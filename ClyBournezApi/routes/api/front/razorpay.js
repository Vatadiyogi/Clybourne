const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const RazorpayRecord = require("../../../models/razorpay-record.model");
const CustomersModel = require("../../../models/customers.model");
const PlanModel = require("../../../models/plan.model");
const PlanRecord = require("../../../models/plan-record.model");
const Transaction = require("../../../models/transactions.model");
const moment = require('moment');
const crypto = require('crypto');

// Initialize Razorpay
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Copy the getUpgradeData function from your Stripe route
async function getUpgradeData(currentPlan, AdvisorPlanId = null) {
  try {
    const currentPlanType = currentPlan.planType;
    let currentDate = new Date(); // Current date

    // Helper function to calculate upgrade details
    const calculateUpgradeDetails = (upgradePlan, currentPlan) => {
      const unutilizedReports = currentPlan.balanceQuota - currentPlan.orders.length;
      const currentUtilizedDays = Math.max(0, Math.floor((currentDate - new Date(currentPlan.startAt)) / (1000 * 60 * 60 * 24))); // Days from startAt to currentDate
      const currentDaysLeft = Math.max(0, Math.floor((new Date(currentPlan.expiresAt) - currentDate) / (1000 * 60 * 60 * 24))); // Days left

      const newAccessDays = parseFloat(upgradePlan.accessDays) - parseFloat(currentUtilizedDays);
      let newExpiresDate = new Date(currentDate);
      newExpiresDate.setDate(newExpiresDate.getDate() + newAccessDays); // Add newAccessDays to the current date

      const newReports = upgradePlan.reports + unutilizedReports;
      const upgradePrice = upgradePlan.price - currentPlan.amount;

      return {
        id: upgradePlan._id,
        planType: upgradePlan.planType,
        name: upgradePlan.name,
        price: upgradePlan.price,
        originalAccessDays: upgradePlan.accessDays,
        originalReports: upgradePlan.reports,
        upgrade_price: upgradePrice,
        access_days: newAccessDays,
        expiresAt: newExpiresDate,
        reports: newReports
      };
    };

    // Check if current plan type is 'BO'
    if (currentPlanType === 'BO') {
      const upgradeBOPlan = await PlanModel.findOne({ planType: "BOP", status: 1, isDeleted: 0 });

      if (upgradeBOPlan) {
        return calculateUpgradeDetails(upgradeBOPlan, currentPlan);
      }
    }

    // Handle "A" plan upgrades
    if (currentPlanType === "A") {
      const currentPlanReport = currentPlan.balanceQuota;

      // Fetch all potential upgrade plans where reports are greater than current plan's report
      const upgradePlan = await PlanModel.findOne({ _id: AdvisorPlanId }); // Sort by reports in ascending order (lowest first)

      // Map over upgradePlans and calculate upgrade details for each
      if (upgradePlan) {
        return calculateUpgradeDetails(upgradePlan, currentPlan);
      }

    }

    // If no upgrade plan is found, return null
    return null;

  } catch (error) {
    console.error("Error fetching upgrade data:", error.message);
    return null; // Return null in case of an error
  }
}

// Helper function to extract and verify token
const verifyAuthToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return { error: 'ACCESS_TOKEN_MISSING' };
    }
    
    // Remove 'Bearer ' prefix if present
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return { error: 'INVALID_TOKEN_FORMAT' };
    }
    
    const secretKey = process.env.ENCRYPTION_KEY;
    const decoded = jwt.verify(token, secretKey);
    
    return { success: true, decoded };
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { error: 'TOKEN_EXPIRED' };
    }
    if (error.name === 'JsonWebTokenError') {
      return { error: 'INVALID_TOKEN' };
    }
    return { error: 'AUTHENTICATION_FAILED' };
  }
};

// ✅ Create Razorpay Order
router.post("/create-order", [
  check("planId", "Plan ID is required!").exists().not().isEmpty(),
  check("planType", "Plan Type is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    // Verify token (handles both with and without Bearer)
    const authResult = verifyAuthToken(req);
    if (authResult.error) {
      return res.status(401).json({ 'status': false, 'message': authResult.error, 'data': [] });
    }

    const decoded = authResult.decoded;
    const user = await CustomersModel.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
    }

    const plan = await PlanModel.findById({ _id: req.body.planId });
    if (!plan) {
      return res.status(500).json({ 'status': false, 'message': "Invalid Plan ID.", 'data': [] });
    }

    let planPrice = plan.price;
    let planReports = plan.reports;
    let planAccessDays = plan.accessDays;

    // User current plan data (SAME LOGIC AS STRIPE)
    if (req.body.planType === 'upgrade') {
      const current_plan = await PlanRecord.find({
        userId: decoded.userId,
        planStatusType: { $in: ['completed', 'active'] },
        expiresAt: { $gt: new Date() }
      }).populate('planId').sort({ createdAt: -1 });
      
      let upgrade_data = [];
      if (current_plan && current_plan.length > 0) {
        if (current_plan[0].planType === 'A') {
          upgrade_data = await getUpgradeData(current_plan[0], req.body.planId);
        } else {
          upgrade_data = await getUpgradeData(current_plan[0]);
        }
      }

      if (upgrade_data && (upgrade_data.length || upgrade_data != null)) {
        planPrice = upgrade_data.upgrade_price;
        planReports = upgrade_data.reports;
        planAccessDays = upgrade_data.access_days;
      }
    }
    // End

    // Convert USD to INR (for Razorpay)
    const conversionRate = process.env.CURRENCY_CONVERSION_RATE || 83;
    const amountInINR = Math.round(planPrice * conversionRate * 100); // Convert to paise

    // Generate unique IDs (SAME PATTERN AS STRIPE)
    const transactionId = moment().valueOf();
    const receipt = `receipt_${transactionId.toString().slice(-8)}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInINR,
      currency: 'INR',
      receipt: receipt,
      notes: {
        planId: plan._id.toString(),
        userId: user._id.toString(),
        planName: plan.name,
        planType: req.body.planType,
        transactionId: transactionId.toString()
      }
    });

    // Create Razorpay record (similar to StripeRecord)
    const razorpayRecord = new RazorpayRecord({
      userId: user._id,
      planId: plan._id,
      selectedPlanType: req.body.planType,
      planPrice: planPrice,
      totalReports: planReports,
      accessDays: planAccessDays,
      transactionId: transactionId,
      orderId: order.id,
      currency: 'INR',
      amountInINR: amountInINR,
      receipt: receipt,
      metadata: {
        order: order,
        userEmail: user.email,
        userName: user.name
      },
      status: 'pending'
    });

    if (await razorpayRecord.save()) {
      return res.status(200).json({
        status: true,
        message: "Order created successfully",
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          key: process.env.RAZORPAY_KEY_ID, // For frontend
          planDetails: plan,
          user: {
            name: user.name,
            email: user.email,
            contact: user.phone || '9999999999'
          }
        }
      });
    } else {
      return res.status(500).json({ status: false, message: "Failed to save order record", 'data': [] });
    }

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ 
      status: false, 
      message: error.error?.description || error.message, 
      'data': [] 
    });
  }
});

// ✅ Verify Razorpay Payment
router.post("/verify-payment", [
  check("razorpay_payment_id", "Payment ID is required!").exists().not().isEmpty(),
  check("razorpay_order_id", "Order ID is required!").exists().not().isEmpty(),
  check("razorpay_signature", "Signature is required!").exists().not().isEmpty(),
  check("planId", "Plan ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    // Verify token (handles both with and without Bearer)
    const authResult = verifyAuthToken(req);
    if (authResult.error) {
      return res.status(401).json({ 'status': false, 'message': authResult.error, 'data': [] });
    }

    const decoded = authResult.decoded;
    const user = await CustomersModel.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: false,
        message: 'Invalid signature. Payment verification failed.'
      });
    }

    // Find the Razorpay record
    const razorpayRecord = await RazorpayRecord.findOne({ 
      orderId: razorpay_order_id,
      userId: user._id
    });

    if (!razorpayRecord) {
      return res.status(404).json({
        status: false,
        message: 'Order not found'
      });
    }

    // Update Razorpay record
    razorpayRecord.razorpayPaymentId = razorpay_payment_id;
    razorpayRecord.razorpaySignature = razorpay_signature;
    razorpayRecord.status = 'completed';
    await razorpayRecord.save();

    const plan = await PlanModel.findById(planId);
    if (!plan) {
      return res.status(404).json({
        status: false,
        message: 'Plan not found'
      });
    }

    // ============ SAVE PLAN LOGIC (SIMILAR TO STRIPE savePlan function) ============
    // Check if user has an active plan
    let userHasPlan = (user.activePlanId === null) ? true : false;
    
    let isPlanExpired = false;
    if (!userHasPlan) {
      const current_date = moment().format();
      if (moment(current_date).isAfter(user.activePlanExpiryDate)) {
        isPlanExpired = true;
      }

      let existingPlan = await PlanRecord.findOne({ userId: user._id, planId: user.activePlanId });
      if (existingPlan && (existingPlan.expiresAt == null || moment(current_date).isAfter(existingPlan.expiresAt))) {
        isPlanExpired = true;
      }

      if (existingPlan && (existingPlan.planStatusType != 'active' || existingPlan.planStatusType != 'queued')) {
        isPlanExpired = true;
      }
    }

    // Find the latest PlanRecord for the user to get the latest planSeqId
    const latestPlanRecord = await PlanRecord.findOne({ userId: user._id }).sort({ planSeqId: -1 });
    let planSeqId = latestPlanRecord ? (latestPlanRecord.planSeqId || 0) + 1 : 1;

    const planRecord = new PlanRecord({
      userId: user._id,
      planId: plan._id,
      planTxnId: plan.sequenceId,
      planType: plan.planType,
      planSeqId: planSeqId,
      amount: razorpayRecord.planPrice,
      orderType: razorpayRecord.selectedPlanType,
      accessDays: razorpayRecord.accessDays,
      startAt: moment().format(),
      expiresAt: (isPlanExpired == true) ? moment().add(razorpayRecord.accessDays, 'days') : (userHasPlan ? moment().add(razorpayRecord.accessDays, 'days') : null),
      balanceQuota: razorpayRecord.totalReports,
      planStatusType: (isPlanExpired == true) ? 'active' : ((userHasPlan == true) ? 'active' : 'queued'),
      paymentGateway: 'razorpay' // Mark as Razorpay payment
    });

    if (await planRecord.save()) {
      // Save transactions (SIMILAR TO STRIPE)
      const transaction = new Transaction({
        orderId: razorpayRecord.transactionId,
        email: user.email,
        customerId: user._id,
        country: user.country,
        planId: plan._id,
        planSeqId: plan.sequenceId,
        planType: plan.planType,
        orderType: razorpayRecord.selectedPlanType === 'new' ? "New" : "Upgrade",
        reportCount: razorpayRecord.totalReports,
        amount: razorpayRecord.planPrice,
        gatewayType: 'Razorpay',
        txnId: razorpay_payment_id,
        status: "Success",
        message: "Payment completed",
      });

      await transaction.save();

      // Update user, if new plan is purchased
      user.activePlanId = plan._id;
      user.activePlanSeqId = plan.sequenceId;
      user.activePlanType = plan.planType;
      user.activePlanExpiryDate = moment().add(razorpayRecord.accessDays, 'days');
      await user.save();

      // ============ UPGRADE PLAN LOGIC (if needed) ============
      if (razorpayRecord.selectedPlanType === 'upgrade') {
        // Mark previous active plan as inactive (similar to Stripe upgradePlan function)
        let existingPlan = await PlanRecord.findOne({
          userId: user._id,
          planStatusType: { $in: ['completed', 'active'] },
          expiresAt: { $gt: new Date() }
        });

        if (existingPlan) {
          existingPlan.expiresAt = null;
          existingPlan.planStatusType = 'inactive';
          await existingPlan.save();
        }

        // Update the new plan record to be active immediately
        planRecord.planStatusType = 'active';
        planRecord.activatedAt = moment().format();
        planRecord.upgradedFromPlanId = existingPlan && existingPlan.orderType === 'new' ? existingPlan._id : existingPlan?.upgradedFromPlanId;
        await planRecord.save();
      }

      return res.status(200).json({
        status: true,
        message: "Payment verified and plan activated successfully",
        data: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          planName: plan.name,
          expiresAt: planRecord.expiresAt,
          reportsRemaining: razorpayRecord.totalReports,
          transactionId: razorpayRecord.transactionId
        }
      });
    } else {
      return res.status(500).json({ status: false, message: "Failed to save plan", 'data': [] });
    }

  } catch (error) {
    console.error('Razorpay verification error:', error);
    return res.status(500).json({ 
      status: false, 
      message: error.message, 
      'data': [] 
    });
  }
});

// ✅ Get Razorpay key for frontend
router.get("/key", (req, res) => {
  return res.status(200).json({
    status: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID
    }
  });
});

// ✅ Test endpoint
router.get("/test", (req, res) => {
  const config = {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'NOT SET',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'NOT SET',
    encryptionKey: process.env.ENCRYPTION_KEY ? 'Set' : 'NOT SET',
    environment: process.env.NODE_ENV || 'development',
    currencyConversionRate: process.env.CURRENCY_CONVERSION_RATE || 83
  };
  
  console.log('Razorpay Configuration Check:', config);
  
  res.json({
    status: true,
    message: 'Razorpay routes are working',
    data: config
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const StripeRecord = require("../../../models/stripe-record.model");
const CustomersModel = require("../../../models/customers.model");
const PlanModel = require("../../../models/plan.model");
const CurrencyModel = require("../../../models/Currency.model");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_KEY);
const currencies = require('currencies.json');
const StripeRecoredModel = require("../../../models/stripe-record.model");
const PlanRecord = require("../../../models/plan-record.model");
const moment = require('moment');

router.post("/create-checkout-session", [
  check("planId", "Plan ID is required!").exists().not().isEmpty(),
  check("planType", "Plan Type is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }
    console.log("reqest data", req.body )
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

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

      // User current plan data
      if (req.body.planType === 'upgrade') {
        const current_plan = await PlanRecord.find({
          userId: decoded.userId,
          planStatusType: { $in: ['completed', 'active'] },
          expiresAt: { $gt: new Date() }
        }
        ).populate('planId').sort({ createdAt: -1 });
        let upgrade_data = []
        if (current_plan) {
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

      const latestRecord = await StripeRecoredModel.find().sort({ createdAt: -1 }).limit(1);
       console.log("latestRecord", latestRecord )
      // const transactionId = (latestRecord && latestRecord.length > 0 && latestRecord[0].transactionId)
      //   ? (parseInt(latestRecord[0].transactionId) + 1)
      //   : 1;
      const transactionId = moment().valueOf();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: plan.name,
              },

              unit_amount: planPrice * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          order_id: transactionId
        },
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.FAILED_URL,
      });
             console.log("latestRecord", latestRecord )
      const stripeRecord = new StripeRecord({
        userId: user._id,
        planId: plan._id,
        selectedPlanType: req.body.planType,
        planPrice: planPrice,
        totalReports: planReports,
        accessDays: planAccessDays,
        transactionId: transactionId,
        sessionId: session.id
      });

      if (await stripeRecord.save()) {
        return res.status(200).json({
          status: true,
           message: "Session ID Created",
          data: {
            url: session.url,  // <-- Add this
            stripeToken: session.id,
            planDetails: plan
          }
        });
      } else {
        return res.status(500).json({ status: false, message: "Something went wrong, please try again later", 'data': [] });
      }
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, 'data': [] });
  }
});

router.post("/update-checkout-session", [
  check("orderId", "Order ID is required!").exists().not().isEmpty(),
  check("sessionId", "Session ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const session = await stripe.checkout.sessions.update(req.body.sessionId, {
      metadata: {
        order_id: req.body.orderId,
      },
    });

    const sessionRecord = await StripeRecord.findOne({ sessionId: req.body.sessionId });
    if (!sessionRecord) {
      return res.status(500).json({ status: false, message: "Invalid Session ID", 'data': [] });
    }

    // Update session id
    sessionRecord.sessionId = session.id;
    await sessionRecord.save();

    return res.status(200).json({ status: true, message: "Session Updated", 'data': { id: session.id } });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, 'data': [] });
  }
});

router.post("/retrieve-checkout-session", [check("sessionId", "Session ID is required!").exists().not().isEmpty()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const session = await stripe.checkout.sessions.retrieve(req.body.sessionId);
    return res.status(200).json({ status: true, message: "Session Updated", 'data': { session: session } });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, 'data': [] });
  }
});

router.post("/expire-checkout-session", [check("sessionId", "Session ID is required!").exists().not().isEmpty()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const session = await stripe.checkout.sessions.expire(req.body.sessionId);
    return res.status(200).json({ status: true, message: "Session Updated", 'data': { session: session } });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, 'data': [] });
  }
});

// router.get('/currency', async (req, res) => {
//   try {
//     // Ensure `currencies` is an array and then map over it
//     let currencyArray = currencies.currencies;

//     // Extracting only `name` and `code` from the array and adding a default status of 1
//     const currencyData = currencyArray.map(currency => ({
//       name: currency.name,
//       code: currency.code,
//       status: 1
//     }));

//     // Inserting the currency data into the Currency model
//     const insertedCurrencies = await CurrencyModel.insertMany(currencyData);

//     return res.status(200).json({ data: insertedCurrencies });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error inserting currencies', details: error.message });
//   }
// });

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

module.exports = router;
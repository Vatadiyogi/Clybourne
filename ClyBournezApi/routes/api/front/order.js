const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const fs = require('fs');
const path = require('path');
const { validate } = require("./../../../middleware/authorizations.middleware");
const { planvalidate } = require("./../../../middleware/plan.middleware");
const { check, validationResult } = require("express-validator");
const EmailTemplate = require("../../../email/sendMail");

const OrderModel = require("../../../models/orders.model");
const CustomersModel = require("../../../models/customers.model");
const ParameterModel = require("../../../models/parameters.model");
const HolidayModel = require("../../../models/holiday.model");
const CountryModel = require("../../../models/Country.model");
const PlanModel = require("../../../models/plan.model");
const PlanRecord = require("../../../models/plan-record.model");
const PlanRecoredModel = require("../../../models/plan-record.model");
const UserModel = require("../../../models/user.model");

// Get all orders
router.get("/order-filter-data", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;

    // Verify the token and extract the user ID
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      decoded = { userId: decoded.userId };

      // Fetch all distinct company names submitted by the user
      const companies = await OrderModel.distinct('business.companyName', { submittedBy: decoded.userId });

      // Fetch all distinct countries
      const countries = await CountryModel.distinct('name');

      // Fetch customer details
      let customerDetails;

      // Step 1: First check for an active plan
      customerDetails = await PlanRecord.findOne({
        userId: decoded.userId,
        planStatusType: 'active'
      }).populate('planId').sort({ createdAt: -1 });

      // Step 2: If no active plan is found
      if (!customerDetails) {
        // Find the latest record that is completed, ignoring queued plans
        customerDetails = await PlanRecord.findOne({
          userId: decoded.userId,
          planStatusType: { $ne: 'queued' } // Ignore queued plans
        }).populate('planId').sort({ createdAt: -1 });

        // Step 3: Ensure it is completed, otherwise return null or handle appropriately
        if (customerDetails && customerDetails.planStatusType !== 'completed') {
          customerDetails = null; // If the latest record is not completed, set it to null
        }
      }
      let customer;
      if (customerDetails) {
        // Calculate days left until the plan expires
        const today = new Date();
        const expiryDate = new Date(customerDetails.expiresAt);
        let msDiff = expiryDate - today;
        let daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
        daysLeft = daysLeft >= 0 ? daysLeft : 0;

        customer = {
          activePlanType: customerDetails.planType,
          TotalPlanOrderedCount: customerDetails.balanceQuota - customerDetails.orders.length,
          activePlanExpiryDate: customerDetails.expiresAt,
          daysLeft: daysLeft,
          planId: customerDetails.planSeqId
        }
      }

      const responseData = {
        countries,
        companies,
        customer
      };

      return res.status(200).json({ status: true, message: "Success: Filter Data Fetched", data: responseData });
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});

router.post("/customer_order", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      decoded = { userId: decoded.userId };

      // Build the query criteria
      const criteria = {};
      criteria["$and"] = [];

      // Always filter by user ID
      criteria["$and"].push({ submittedBy: { $eq: decoded.userId } });

      // Handle search parameter
      if (req.body.search && req.body.search.trim() !== '') {
        const searchTerm = req.body.search.trim();
        const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive regex

        // Create an $or condition for search across multiple fields
        const searchConditions = {
          $or: [
            { 'business.companyName': { $regex: searchRegex } },
            { 'business.country': { $regex: searchRegex } }
          ]
        };

        // For customerOrderSequence (which is a number), use exact match
        if (!isNaN(searchTerm)) {
          searchConditions.$or.push({ customerOrderSequence: parseInt(searchTerm) });
        }

        criteria["$and"].push(searchConditions);
      }

      // Handle status filter
      if (req.body.status && req.body.status.trim() !== '') {
        criteria["$and"].push({ 'matadata.status': { $eq: req.body.status } });
      }

      // Handle date range filters
      if (req.body.startDate && req.body.endDate) {
        criteria["$and"].push({
          createdAt: {
            $gte: moment(req.body.startDate),
            $lte: moment(req.body.endDate)
          }
        });
      }

      let user = await CustomersModel.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
      }

      // Determine sort field and order
      let sortField = 'orderId'; // Default sort
      let sortOrder = -1; // Default descending

      if (req.body.sortBy) {
        switch (req.body.sortBy) {
          case 'createdAt':
            sortField = 'createdAt';
            break;
          case 'submittedOn':
            sortField = 'submittedOn';
            break;
          case 'completedOn':
            sortField = 'completedOn';
            break;
          default:
            sortField = 'orderId';
        }
      }

      if (req.body.sortOrder) {
        sortOrder = req.body.sortOrder === 'asc' ? 1 : -1;
      }

      console.log('Sorting by:', sortField, 'order:', sortOrder); // Debug log
      console.log('Search criteria:', JSON.stringify(criteria, null, 2)); // Debug log

      let orders;
      try {
        // Apply sorting
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;

        orders = await OrderModel.find(criteria)
          .sort(sortOptions)
          .populate('plan.planOrderId');

      } catch (dbError) {
        console.error('Database query error:', dbError);
        // Fallback: get all orders and sort in memory
        const allOrders = await OrderModel.find({ submittedBy: decoded.userId })
          .populate('plan.planOrderId');

        // Filter in memory if needed
        if (req.body.search && req.body.search.trim() !== '') {
          const searchTerm = req.body.search.trim();
          orders = allOrders.filter(order => {
            const companyName = order?.business?.companyName || '';
            const country = order?.business?.country || '';
            const customerOrderSeq = order.customerOrderSequence?.toString() || '';

            return (
              companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              country.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customerOrderSeq.includes(searchTerm)
            );
          });
        } else {
          orders = allOrders;
        }

        // Sort in memory
        orders.sort((a, b) => {
          let aValue, bValue;

          switch (sortField) {
            case 'createdAt':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            case 'submittedOn':
              aValue = a.submittedOn ? new Date(a.submittedOn) : new Date(0);
              bValue = b.submittedOn ? new Date(b.submittedOn) : new Date(0);
              break;
            case 'completedOn':
              aValue = a.completedOn ? new Date(a.completedOn) : new Date(0);
              bValue = b.completedOn ? new Date(b.completedOn) : new Date(0);
              break;
            default:
              aValue = a.orderId;
              bValue = b.orderId;
          }

          return sortOrder === 1 ?
            (aValue > bValue ? 1 : -1) :
            (aValue < bValue ? 1 : -1);
        });
      }

      console.log('Found orders:', orders.length); // Debug log

      if (!orders || orders.length === 0) {
        return res.status(200).json({ status: true, message: "No orders found", data: { orders_updated: [] } });
      }

      const report_params = await ParameterModel.find({}).limit(1);
      let hoursAllowed = report_params ? report_params[0].hoursAllowed : 0;
      const current_date = moment().format();

      const baseUrl = `${process.env.APIURL}uploads/orders`;

      const orders_updated = orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId ?? "",
        customerOrderSequence: order.customerOrderSequence ?? "",
        companyName: order?.business?.companyName ?? "",
        country: order?.business?.country ?? "",
        status: order?.matadata?.status ?? "",
        createdAt: order.createdAt ?? "",
        submittedOn: order.submittedOn ?? "",
        completedOn: order.completedOn ?? "",
        resubmit_date: order.completedOn ? moment(order.completedOn).add(hoursAllowed, 'hours') : "",
        remaining_hours: (order.completedOn && moment(current_date).isBefore(moment(order.completedOn).add(hoursAllowed, 'hours')))
          ? moment(moment(order.completedOn).add(hoursAllowed, 'hours')).diff(moment(current_date), 'hours')
          : "",
        resubmit_pending: (order.completedOn && moment(current_date).isSameOrBefore(moment(order.completedOn).add(hoursAllowed, 'hours')))
          ? 1
          : 0,
        report_url: order.reportDocName ? `${baseUrl}/${order._id}/${order.reportDocName}` : "",
        revised_report_url: order.reportDocName ? `${baseUrl}/${order._id}/${order.reportDocName}` : "",
        custody: order.custody ?? "",
        orderplan: order.plan || "",
      }));

      return res.status(200).json({
        status: true,
        message: orders_updated.length > 0 ? "Success: Orders Fetched" : "No orders found",
        data: { orders_updated }
      });
    });
  } catch (error) {
    console.error('Error in customer_order route:', error);
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});

router.post('/store', [
  // Validation rules
  check("companyName", "Company Name is required!").exists().not().isEmpty(),
  check("companyType", "Company Type is required!").exists().not().isEmpty(),
  check("industryType", "Industry Type is required!").exists().not().isEmpty(),
  check("companyAge", "Company Age is required!").exists().not().isEmpty(),
  check("country", "Country is required!").exists().not().isEmpty(),
  check("FinYrEndDate", "Financial year date is required!").exists().not().isEmpty().isNumeric().withMessage("Invalid Date, value can be between 1 to 31"),
  check("FinYrEndMonth", "Financial year month is required!").exists().not().isEmpty(),
  check("FinYrEnd", "Financial year is required!").exists().not().isEmpty(),
  check("earningTrend", "Earning trend is required!").exists().not().isEmpty(),
  check("description", "Description is required!").exists().not().isEmpty(),
  check("contact", "Contact is required!").custom((value, { req }) => {
    // Accept string contact
    if (typeof value === 'string' && value.trim() !== '') {
      return true;
    }

    // Or accept object contact
    if (typeof value === 'object' && value !== null) {
      // Check if it has at least phoneNumber or fullNumber
      if (value.phoneNumber || value.fullNumber) {
        return true;
      }
    }

    throw new Error('Contact must be a valid phone number or object with phoneNumber/fullNumber');
  }),
  check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
  check("currency", "Currency is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;

    jwt.verify(token, secretKey, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      try {
        // Find the user in the database
        const user = await CustomersModel.findOne({ _id: decoded.userId });
        if (!user) {
          return res.status(404).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
        }

        // Find the latest orderId and customerOrderSequence
        const latestRecord = await OrderModel.find().sort({ createdAt: -1 }).limit(1);
        const orderId = latestRecord.length > 0 ? (parseInt(latestRecord[0].orderId) + 1) : 1;

        const customerLatestRecord = await OrderModel.find({ submittedBy: decoded.userId }).sort({ createdAt: -1 }).limit(1);
        const customerOrderSequence = customerLatestRecord.length > 0 ? (parseInt(customerLatestRecord[0].customerOrderSequence) + 1) : 1;

        // Extract fields from the request body
        const { companyName, companyType, industryType, companyAge, country, FinYrEndDate, FinYrEndMonth, earningTrend, description, contact, email, currency, FinYrEnd,similarCompany } = req.body;
        let contactData = {};

        if (typeof contact === 'string') {
          // Parse string phone number
          const phoneNumber = contact.replace(/\D/g, '');
          const countryCodeMatch = contact.match(/^\+(\d+)/);
          const countryCode = countryCodeMatch ? countryCodeMatch[1] : '91';

          contactData = {
            countryCode: countryCode,
            dialCode: `+${countryCode}`,
            phoneNumber: phoneNumber.replace(new RegExp(`^${countryCode}`), ''),
            fullNumber: contact
          };
        } else if (typeof contact === 'object' && contact !== null) {
          // Use object as-is
          contactData = contact;
        }

        const business = { companyName, companyType, industryType, companyAge, country, FinYrEndDate, FinYrEndMonth, FinYrEnd, earningTrend, description, contact: contactData, email, currency, similarCompany: similarCompany || "",  };
        const matadata = {
          state: "Request Received",
          userId: decoded.userId,
          status: "Pending Submission",
          customerId: decoded.userId,
        };

        const contactdata = {
          name: (user.first_name + " " + user.last_name) ?? "",
          email: user.email ?? "",
          phone: user.phone ?? ""
        };

        let plandata = null;
        const current_plan = await PlanRecord.find({ userId: decoded.userId, planStatusType: 'active' }).populate('planId').sort({ createdAt: -1 });
        if (current_plan && current_plan.length > 0) {
          plandata = {
            planId: current_plan[0].planId._id,
            planName: current_plan[0].planId.name,
            planType: current_plan[0].planId.planType,
            planSequenceId: current_plan[0].planId.sequenceId,
            planOrderId: current_plan[0]._id
          };
        }

        // Create a new order
        const order = new OrderModel({
          submittedBy: decoded.userId,
          orderId,
          customerOrderSequence,
          custody: "Customer",
          business,
          matadata,
          contact: contactdata,
          plan: plandata
        });

        const saved_order = await order.save();
        if (saved_order) {
          // Find active plan, and update order count in plan record
          let unutilizedReports = 0;
          const current_date = moment().format();
          const current_plan = await PlanRecord.find({ userId: decoded.userId, planStatusType: 'active' }).populate('planId').sort({ createdAt: -1 });
          if (current_plan && current_plan.length > 0) {
            let orders = current_plan[0].orders.length ? current_plan[0].orders : [];
            orders.push(saved_order._id);
            await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
              $set: { orders }
            });

            unutilizedReports = current_plan[0].balanceQuota - orders.length;
            if (unutilizedReports === 0) {
              await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
                $set: { planStatusType: 'completed' }
              });

              if (moment(current_date).isAfter(current_plan[0].expiresAt)) {
                await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
                  $set: { planStatusType: 'expired' }
                });

                // Update user plan as null
                await CustomersModel.updateOne({ _id: decoded.userId }, {
                  $set: {
                    activePlanId: null,
                    activePlanSeqId: null,
                    activePlanType: null,
                    activePlanExpiryDate: null,
                  }
                });
              }

              // Activate the next queued plan
              const queued_plan = await PlanRecord.find({ userId: decoded.userId, planStatusType: 'inactive' }).limit(1);
              if (queued_plan.length > 0) {
                await PlanRecord.updateOne({ _id: queued_plan[0]._id }, {
                  $set: {
                    startAt: moment().format(),
                    expiresAt: moment().add(queued_plan[0].accessDays, 'days'),
                    activatedAt: moment().format(),
                    planStatusType: 'active'
                  }
                });

                // Update user plan details with new queued plan
                await CustomersModel.updateOne({ _id: decoded.userId }, {
                  $set: {
                    activePlanId: queued_plan[0].planId,
                    activePlanSeqId: queued_plan[0].planTxnId,
                    activePlanType: queued_plan[0].planType,
                    activePlanExpiryDate: moment().add(queued_plan[0].accessDays, 'days'),
                  }
                });
              }
            }
          }

          return res.status(200).json({ 'status': true, 'message': "Order created successfully.", 'data': { order: saved_order } });
        } else {
          return res.status(500).json({ 'status': false, 'message': "Something went wrong, please try again later.", 'data': [] });
        }
      } catch (dbError) {
        return res.status(500).json({ 'status': false, 'message': "Database operation failed.", 'data': [] });
      }
    });
  } catch (error) {
    return res.status(500).json({ 'status': false, 'message': "Internal Server Error.", 'data': [] });
  }
});

// Store documents and create new order
router.post('/store-documents', async (req, res) => {
  try {
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

      // Order ID Logic
      const latestRecord = await OrderModel.find().sort({ createdAt: -1 }).limit(1);
      const orderId = latestRecord.length > 0 ? (parseInt(latestRecord[0].orderId) + 1) : 1;

      const customerLatestRecord = await OrderModel.find({ submittedBy: decoded.userId }).sort({ createdAt: -1 }).limit(1);
      const customerOrderSequence = customerLatestRecord.length > 0 ? (parseInt(customerLatestRecord[0].customerOrderSequence) + 1) : 1;

      const userUploadDir = path.join(__dirname, '../../../uploads/customer/', String(orderId));

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(userUploadDir)) {
        fs.mkdirSync(userUploadDir, { recursive: true }); // Create the directory recursively
      }

      let documents = [];
      if (req.files && req.files.document) {
        let filesArray = Array.isArray(req.files.document) ? req.files.document : [req.files.document]; // Ensure it's an array

        for (let i = 0; i < filesArray.length; i++) {
          let document = filesArray[i];
          const fileName = document.name;

          await new Promise((resolve, reject) => {
            const uploadPath = path.join(userUploadDir, fileName); // Define the full upload path

            document.mv(uploadPath, function (error) {
              if (error) {
                return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
              }

              documents.push({ name: fileName });
              resolve(true);
            });
          });
        }

        const matadata = {
          state: "Request Received",
          userId: decoded.userId,
          status: "Help Requested",
          customerId: decoded.userId,
        }

        const contactdata = {
          name: (user.first_name + " " + user.last_name) ?? "",
          email: user.email ?? "",
          phone: user.phone ?? ""
        };

        let plandata = null;
        const current_plan = await PlanRecord.find({ userId: decoded.userId, planStatusType: 'active' }).populate('planId').sort({ createdAt: -1 });

        if (current_plan && current_plan.length > 0) {
          plandata = {
            planId: current_plan[0].planId._id,
            planName: current_plan[0].planId.name,
            planType: current_plan[0].planId.planType,
            planSequenceId: current_plan[0].planId.sequenceId,
            planOrderId: current_plan[0]._id
          };
        }

        // Save the order
        const order = new OrderModel({
          submittedBy: decoded.userId,
          orderId: orderId,
          customerOrderSequence: customerOrderSequence,
          custody: "Customer",
          documents: documents,
          remarks: req.body.remarks || null, // Add remarks separately
          matadata: matadata,
          contact: contactdata,
          plan: plandata
        });

        const saved_order = await order.save();
        if (saved_order) {
          // Find active plan, and update order count in plan record
          const current_date = moment().format();
          let unutilizedReports = 0;
          if (current_plan) {
            let orders = current_plan[0].orders.length ? current_plan[0].orders : [];
            orders.push(saved_order._id);
            await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
              $set: {
                orders: orders
              }
            });

            unutilizedReports = current_plan[0].balanceQuota - orders.length; // Find unutilized reports
            if (unutilizedReports == 0) {
              // Mark current plan as inactive, if no more report balance is pending
              await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
                $set: { planStatusType: 'completed' }
              });

              if (moment(current_date).isAfter(current_plan[0].expiresAt)) {
                await PlanRecord.updateOne({ _id: current_plan[0]._id }, {
                  $set: { planStatusType: 'expired' }
                });

                // Remove current plan of user
                await CustomersModel.updateOne({ _id: decoded.userId }, {
                  $set: {
                    activePlanId: null,
                    activePlanSeqId: null,
                    activePlanType: null,
                    activePlanExpiryDate: null
                  }
                });
              }

              // Active next queued plan
              const queued_plan = await PlanRecord.find({ userId: decoded.userId, planStatusType: 'inactive' }).limit(1);
              if (queued_plan.length) {
                await PlanRecord.updateOne({ _id: queued_plan[0]._id }, {
                  $set: {
                    startAt: moment().format(),
                    expiresAt: moment().add(queued_plan[0].accessDays, 'days'),
                    activatedAt: moment().format(),
                    planStatusType: 'active'
                  }
                });

                // Update user plan details with new queued plan
                await CustomersModel.updateOne({ _id: decoded.userId }, {
                  $set: {
                    activePlanId: queued_plan[0].planId,
                    activePlanSeqId: queued_plan[0].planTxnId,
                    activePlanType: queued_plan[0].planType,
                    activePlanExpiryDate: moment().add(queued_plan[0].accessDays, 'days'),
                  }
                });
              }
            }
          }

          //Send account verification email
          let html = await EmailTemplate.documentUploadConfirmation(process.env.CONTACTEMAIL, user.first_name);
          let result = await EmailTemplate.sendMail({
            email: user.email,
            subject: await EmailTemplate.fetchSubjectTemplate(3),
            application_name: "FinVal",
            text: "",
            html: html
          });

          if (!result) {
            return res.status(500).json({ 'status': false, 'message': "Order created successfully. Email confirmation sending failed, please try again later", 'data': [] });
          }
          // End: Verification Mail

          return res.status(200).json({ 'status': true, 'message': "Order created successfully.", 'data': { order } });
        } else {
          return res.status(500).json({ 'status': false, 'message': "Something went wrong, please try again later", 'data': [] });
        }
      } else {
        return res.status(500).json({ 'status': false, 'message': "No documents found, please try again later", 'data': [] });
      }
    });
  } catch (error) {
    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
  }
});

// Update/re-upload a document
router.put('/store-documents', [
  check("orderId", "Order ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      let user = await CustomersModel.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
      }

      let order = await OrderModel.findById(req.body.orderId);
      if (!order) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Order ID.", 'data': [] });
      }

      const userUploadDir = path.join(__dirname, '../../../uploads/customer/', String(order.orderId));

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(userUploadDir)) {
        fs.mkdirSync(userUploadDir, { recursive: true }); // Create the directory recursively
      }

      let documents = order.documents;
      const remarks = req.body.remarks ?? order.remarks;
      if (req.files && req.files.document) {
        let filesArray = Array.isArray(req.files.document) ? req.files.document : [req.files.document]; // Ensure it's an array
        for (let i = 0; i < filesArray.length; i++) {
          let document = filesArray[i];
          const fileName = document.name;

          await new Promise((resolve, reject) => {
            const uploadPath = path.join(userUploadDir, fileName); // Define the full upload path

            document.mv(uploadPath, function (error) {
              if (error) {
                return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
              }

              documents.push({ name: fileName });
              resolve(true);
            });
          });
        }

        //Send account verification email
        let html = await EmailTemplate.documentUploadConfirmation(process.env.CONTACTEMAIL, user.first_name);
        let result = await EmailTemplate.sendMail({
          email: user.email,
          subject: await EmailTemplate.fetchSubjectTemplate(3),
          application_name: "FinVal",
          text: "",
          html: html
        });

        if (!result) {
          return res.status(500).json({ 'status': false, 'message': "Order updated successfully. Email confirmation sending failed, please try again later", 'data': [] });
        }

        await OrderModel.updateOne({ _id: order._id }, {
          $set: {
            documents: documents,
            remarks: remarks,
            'matadata.status': "Help Requested",
          }
        });

        return res.status(200).json({ 'status': true, 'message': "Order updated successfully.", 'data': [] });
      } else {
        return res.status(500).json({ 'status': false, 'message': "No documents found, please try again later", 'data': [] });
      }

    });
  } catch (error) {
    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
  }
});

// Delete a document
router.delete('/store-documents', [
  check("orderId", "Order ID is required!").exists().not().isEmpty(),
  check("documentId", "Document ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const { orderId, documentId } = req.body;
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      let user = await CustomersModel.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
      }

      let order = await OrderModel.findById(req.body.orderId);
      if (!order) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Order ID.", 'data': [] });
      }

      // Remove the document from the order
      const updateResult = await OrderModel.updateOne(
        { _id: orderId },
        { $pull: { documents: { _id: documentId } } }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(500).json({ status: false, message: "Failed to remove document.", data: [] });
      }

      return res.status(200).json({ 'status': true, 'message': "Document has been removed.", 'data': [] });
    });
  } catch (error) {
    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
  }
});

// Update Order - Fixed version
router.put('/update', [
  check("orderId", "Order ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    console.log('=== BALANCE SHEET UPDATE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // ✅ FIX: DESTRUCTURE FIRST BEFORE USING VARIABLES
    const {
      orderId,
      businessdata,
      contactdata,
      financedata,
      forecast_inc_stmt_data,
      forcast_bal_sheet_data,
      forcast_rip_days_data
    } = req.body;

    // ✅ NOW SAFELY USE THE VARIABLES
    // console.log('forcast_bal_sheet_data:', forcast_bal_sheet_data);
    // console.log('forcast_rip_days_data:', forcast_rip_days_data);
    console.log('====================================');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log('Validation errors:', errors.array());
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }

    const order = await OrderModel.findById(orderId); // Use destructured orderId
    if (!order) {
      console.log('Order not found for ID:', orderId);
      return res.status(500).json({ 'status': false, 'message': "Invalid Order.", 'data': [] });
    }

    // console.log('Found order:', order._id);
    // console.log('Current order status:', order.matadata.status);

    const order_completed = order.matadata.status === 'Completed' ? 1 : 0;
    const current_date = moment().format();

    const report_params = await ParameterModel.find({}).limit(1);
    let hoursAllowed = report_params ? report_params[0].hoursAllowed : 0;
    let resubmit_date = order.completedOn ? moment(order.completedOn).add(hoursAllowed, 'hours') : "";
    if (order_completed === 1 && moment(current_date).isAfter(resubmit_date)) {
      return res.status(500).json({ 'status': false, 'message': "Order can not be modified after re-submit date.", 'data': [] });
    }

    if (order && order.matadata.status === 'Completed' && !order.initial_input) {
      order.initial_input = { ...order._doc };
      order.custody = "Customer";
      order.documents = [];
      await order.save();
    }

    // Process other data types (businessdata, contactdata, financedata, etc.)
    if (businessdata) {
      if (order && order.matadata.status !== 'Completed') {
        let contactData = {};

        if (typeof businessdata.contact === 'string') {
          // Parse string phone number
          const phoneNumber = businessdata.contact.replace(/\D/g, '');
          const countryCodeMatch = businessdata.contact.match(/^\+(\d+)/);
          const countryCode = countryCodeMatch ? countryCodeMatch[1] : '91';

          contactData = {
            countryCode: countryCode,
            dialCode: `+${countryCode}`,
            phoneNumber: phoneNumber.replace(new RegExp(`^${countryCode}`), ''),
            fullNumber: businessdata.contact
          };
        } else if (typeof businessdata.contact === 'object' && businessdata.contact !== null) {
          // Use object as-is
          contactData = businessdata.contact;
        }

        await OrderModel.updateOne({ _id: order._id }, {
          $set: {
            business: {
              companyType: businessdata.companyType,
              industryType: businessdata.industryType,
              similarCompany: businessdata.similarCompany,
              companyAge: businessdata.companyAge,
              developmentStage: businessdata.developmentStage,
              country: businessdata.country,
              currency: businessdata.currency,
              lastFinYrEnd: businessdata.lastFinYrEnd,
              earningTrend: businessdata.earningTrend,
              scalable: businessdata.scalable,
              description: businessdata.description,
              companyName: businessdata.companyName,
              contact: contactData,
              email: businessdata.email,
              FinYrEndDate: businessdata.FinYrEndDate,
              FinYrEndMonth: businessdata.FinYrEndMonth,
              FinYrEnd: businessdata.FinYrEnd,
            }
          }
        });
      }
    }

    if (contactdata) {
      await OrderModel.updateOne({ _id: order._id }, {
        $set: {
          contact: {
            name: contactdata.name,
            email: contactdata.email,
            phone: contactdata.phone
          }
        }
      });
    }

    if (financedata) {
      await OrderModel.updateOne({ _id: order._id }, {
        $set: {
          finance: {
            valueType: financedata.valueType,
            dataYear: financedata.dataYear,
            unitOfNumber: financedata.unitOfNumber,
            sales: financedata.sales,
            costOfSales: financedata.costOfSales,
            ebitda: financedata.ebitda,
            depreciation: financedata.depreciation,
            interestExpense: financedata.interestExpense,
            netProfit: financedata.netProfit,
            cashBalance: financedata.cashBalance,
            debtLoan: financedata.debtLoan,
            equity: financedata.equity,
            receivables: financedata.receivables,
            inventories: financedata.inventories,
            payables: financedata.payables,
            netFixedAssets: financedata.netFixedAssets
          }
        }
      });
    }

    if (forecast_inc_stmt_data && forecast_inc_stmt_data.length) {
      const forcast_inc_stmt_record = forecast_inc_stmt_data.map((item) => {
        return {
          salesGrowthRate: item.sales,
          cogs: item.cogs,
          ebitdaMargin: item.ebitdaMargin,
          interestRate: item.interestRate,
          depreciationRate: item.depreciationRate,
          netProfitMargin: item.netProfitMargin
        }
      });
      // console.log("Payload from backend",salesGrowthRate)
      await OrderModel.updateOne({ _id: order._id }, {
        $set: { forcast_inc_stmt: forcast_inc_stmt_record }
      });
    }

    // ✅ NOW forcast_bal_sheet_data IS PROPERLY DEFINED
    if (forcast_bal_sheet_data && forcast_bal_sheet_data.length) {
      console.log('Processing balance sheet data:', forcast_bal_sheet_data);

      const forcast_bal_sheet_record = forcast_bal_sheet_data.map((item) => {
        return {
          fixedAssets: item.fixedAssets,
          debtLoan: item.debtLoan
        }
      });

      console.log('Mapped balance sheet record:', forcast_bal_sheet_record);

      await OrderModel.updateOne({ _id: order._id }, {
        $set: { forcast_bal_sheet: forcast_bal_sheet_record }
      });

      console.log('Balance sheet data saved to database');
    }

    // ✅ NOW forcast_rip_days_data IS PROPERLY DEFINED
    if (forcast_rip_days_data) {
      console.log('Processing working capital data:', forcast_rip_days_data);

      await OrderModel.updateOne({ _id: order._id }, {
        $set: {
          forcast_rip_days: {
            receivableDays: forcast_rip_days_data.receivableDays,
            inventoryDays: forcast_rip_days_data.inventoryDays,
            payableDays: forcast_rip_days_data.payableDays
          }
        }
      });

      console.log('Working capital data saved to database');
    }

    console.log('=== UPDATE COMPLETED SUCCESSFULLY ===');
    return res.status(200).json({ 'status': true, 'message': "Order updated successfully.", 'data': [] });

  } catch (error) {
    console.error('Error in balance sheet update:', error);
    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
  }
});
//Preview Order Details
router.get('/preview/:orderId', async (req, res) => {
  try {
    // Fetch order details and populate customer data
    const order = await OrderModel.findById(req.params.orderId).populate({
      path: 'matadata.customerId',
      select: 'first_name last_name email phone activePlanType activeSeqId'
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    //Calculation Part of Order
    const customer = order.matadata.customerId;
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    let editAllowed = order.matadata.status === 'Submitted' || order.matadata.status === 'Completed' || order.matadata.status === 'Re-Submitted' || order.matadata.status === 'Completed (Revised)' ? false : true;

    const planOrderId = order.plan?.planOrderId;
    if (planOrderId) {
      let current_plan = await PlanRecord.findOne({
        '_id': planOrderId
      });
      if (current_plan && current_plan.planStatusType === 'expired') {
        editAllowed = false; // If the latest record is not completed, set it to null
      }
    }


    let finData = {};
    let forecastData = {};
    let documents = {};
    //Create Graph Data 
    if (order.finance) {
      finData = {
        sales: [order.finance.sales],
        costOfSales: [order.finance.costOfSales],
        ebitda: [order.finance.ebitda],
        netProfit: [order.finance.netProfit],
        cashBalance: [order.finance.cashBalance],
        year: [order.finance.dataYear, order.finance.dataYear + 1, order.finance.dataYear + 2, order.finance.dataYear + 3, order.finance.dataYear + 4, order.finance.dataYear + 5],
        valueType: [order.finance.valueType]
      }
    }

    if (order.forcast_inc_stmt) {
      let values1 = [order.forcast_inc_stmt[0].salesGrowthRate, order.forcast_inc_stmt[1].salesGrowthRate, order.forcast_inc_stmt[2].salesGrowthRate, order.forcast_inc_stmt[3].salesGrowthRate, order.forcast_inc_stmt[4].salesGrowthRate];
      let values2 = [order.forcast_inc_stmt[0].cogs, order.forcast_inc_stmt[1].cogs, order.forcast_inc_stmt[2].cogs, order.forcast_inc_stmt[3].cogs, order.forcast_inc_stmt[4].cogs];
      let values3 = [order.forcast_inc_stmt[0].ebitdaMargin, order.forcast_inc_stmt[1].ebitdaMargin, order.forcast_inc_stmt[2].ebitdaMargin, order.forcast_inc_stmt[3].ebitdaMargin, order.forcast_inc_stmt[4].ebitdaMargin];
      let values4 = [order.forcast_inc_stmt[0].netProfitMargin, order.forcast_inc_stmt[1].netProfitMargin, order.forcast_inc_stmt[2].netProfitMargin, order.forcast_inc_stmt[3].netProfitMargin, order.forcast_inc_stmt[4].netProfitMargin];

      forecastData = [
        { label: "Forecasted Sales Growth Rate (Y-o-Y) (%)", values: values1 },
        { label: "Forecasted COGS (as % of revenue) (%)", values: values2 },
        { label: "Forecasted EBITDA Margin (%)", values: values3 },
        { label: "Forecasted Net Profit Margin (%)", values: values4 }
      ]
    }

    if (order.documents) {
      documents = order.documents;
    }

    const responseData = {
      orderId: order._id,
      customer: {
        customerId: customer._id,
        customerName: `${customer.first_name} ${customer.last_name}`,
        customerEmail: customer.email,
        customerContact: customer.phone,
        planType: customer.activePlanType,
        planSeq: customer.activeSeqId,
        // Add other relevant customer fields as needed
      },
      editAllowed: editAllowed,
      order: {
        systemOrderId: order.orderId,
        customerSequence: order.customerOrderSequence,
        submittedOn: order.submittedOn,
        companyName: order.business?.companyName,
        assignedId: order.assigned_to,
        status: order.matadata.status,
        plan: order.plan,
        custody: order.custody,
        business: {
          business: order.business
        },
        // Add other relevant order fields as needed
      },
      calculations: {
        finance: order.finance,
        forecast_inc_stmt: order.forcast_inc_stmt,
        forecast_bal_sheet: order.forcast_bal_sheet,
        forecast_rip_days: order.forcast_rip_days,
      },
      graphData: {
        finData: finData,
        forecastData: forecastData
      },
      documents: {
        document: documents,
        remarks: order.remarks
      }
    };

    res.json(responseData);
  } catch (err) {
    console.error('Error fetching order and customer data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit order
router.put('/submit-order', [
  check("orderId", "Order ID is required!").exists().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
    }
    const order = await OrderModel.findById(req.body.orderId);
    if (!order) {
      return res.status(500).json({ 'status': false, 'message': "Invalid Order.", 'data': [] });
    }

    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async function (error, decoded) {
      if (error) {
        return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
      }

      let role = req.body.role && req.body.role === 'admin' ? 'admin' : 'user';
      let user = null;
      if (role === 'admin') {
        user = await UserModel.findOne({ _id: decoded.userId });
        if (!user) {
          return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
        }
      } else {
        user = await CustomersModel.findOne({ _id: decoded.userId });
        if (!user) {
          return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
        }
      }

      const report_params = await ParameterModel.find({}).limit(1);
      let workingDays = report_params ? report_params[0].workingDays : 0;

      let newMessage = '';  // Initialize newMessage at the start
      const order_completed = order.matadata.status === 'Completed' ? 1 : 0;
      if (order_completed === 1) {
        let holiday_count = 0;
        const holiday = await HolidayModel.find({
          "date": {
            $gte: moment().format(),
            $lte: moment().add(workingDays, 'days')
          }
        });

        workingDays += holiday.length;

        let due_date = moment().add(workingDays, 'days');
        let startDate = moment().format();
        while (due_date.isSameOrAfter(startDate)) {
          if (moment(startDate).day() === 0 || moment(startDate).day() === 6) {
            holiday_count++;
          }

          startDate = moment(startDate).add(1, 'day');
        }

        due_date = moment().add((workingDays + holiday_count), 'days');
        let formattedDueDate = due_date.utc().format('DD-MMM-YYYY HH:mm [GMT]'); // Format the due date

        await OrderModel.updateOne({ _id: order._id }, {
          $set: {
            revisedSubmittedOn: moment().format(),
            last_submitted_date: moment().format(),
            revisedSubmittedBy: decoded.userId,
            'matadata.status': "Re-Submitted",
            custody: "Company",
            submittedByRole: role === 'admin' ? 'Admin' : 'User',
            submittedBy: decoded.userId,
            due_date: due_date,
          }
        });

        // Send an email
        let html = await EmailTemplate.reportSubmitConfirmation(formattedDueDate, user.first_name, order.business.companyName, process.env.CONTACTEMAIL);
        let result = await EmailTemplate.sendMail({
          email: user.email,
          subject: await EmailTemplate.fetchSubjectTemplate(6),
          application_name: "FinVal",
          text: "",
          html: html
        });

        newMessage = 'Thank you for re-submitting your modified order. You will get the Revised valuation report by ' + formattedDueDate + ' in your email. The report can then also be download from the My Orders screen.';  // Message for re-submission
      } else {
        // Find due date
        let holiday_count = 0;
        const holiday = await HolidayModel.find({
          "date": {
            $gte: moment().format(),
            $lte: moment().add(workingDays, 'days')
          }
        });

        workingDays += holiday.length;

        let due_date = moment().add(workingDays, 'days');
        let startDate = moment().format();
        while (due_date.isSameOrAfter(startDate)) {
          if (moment(startDate).day() === 0 || moment(startDate).day() === 6) {
            holiday_count++;
          }

          startDate = moment(startDate).add(1, 'day');
        }

        due_date = order.matadata.status === 'Help Requested' && role === 'user' ? null : moment().add((workingDays + holiday_count), 'days');
        let formattedDueDate = order.matadata.status === 'Help Requested' && role === 'user' ? null : moment().add((workingDays + holiday_count), 'days').utc().format('DD-MMM-YYYY HH:mm [GMT]');

        // let newStatus = order.matadata.status === 'Help Requested' && role === 'admin' ? 'Submitted' : order.matadata.status === 'Pending Submission' && role === 'user' ? 'Submitted' : 'Help Requested';
        let newStatus;

        if (order.matadata.status === 'Help Requested' && role === 'admin') {
          newStatus = 'Submitted';
        } else if (order.matadata.status === 'Pending Submission' && role === 'user') {
          // Check if this is a complete submission (not just document upload)
          newStatus = 'Submitted'; // This should be "Submitted" for complete form submission
        } else if (order.matadata.status === 'Help Requested' && role === 'user') {
          // User had requested help before
          newStatus = 'Help Requested';
        } else {
          // Default case for first-time complete submission
          newStatus = 'Submitted';
        }
        newMessage = newStatus === 'Help Requested'
          ? 'Thank you for submitting your order. As you have requested for support in completing the input financial data, we will be contacting you in case more information is required. We will let you know when the input data is completed and verified.'
          : 'Thank you for submitting your order. You will get the valuation report by ' + due_date.utc().format('DD-MMM-YYYY HH:mm [GMT]'); + ' in your email. The report can then also be downloaded from the My Orders screen.';

        // const custody = order.matadata.status === 'Help Requested' ? 'Fin-Advisor' : 'Company';
        await OrderModel.updateOne({ _id: order._id }, {
          $set: {
            submittedOn: moment().format(),
            submittedBy: decoded.userId,
            custody: 'Company',
            due_date: due_date,
            'matadata.status': newStatus,
            submittedByRole: role === 'admin' ? 'Admin' : 'User'
          }
        });

        // Send an email
        if (order.matadata.status === 'Help Requested' && role === 'user') {
          let html = await EmailTemplate.reportSubmitWithDocument(user.first_name, order.business.companyName, process.env.CONTACTEMAIL);
          let result = await EmailTemplate.sendMail({
            email: user.email,
            subject: await EmailTemplate.fetchSubjectTemplate(5),
            application_name: "FinVal",
            text: "",
            html: html
          });
        } else if (order.matadata.status === 'Help Requested' && role === 'admin') {
          let html = await EmailTemplate.adminOrderSubmit(formattedDueDate, user.first_name, order.business.companyName, process.env.CONTACTEMAIL);
          let result = await EmailTemplate.sendMail({
            email: user.email,
            subject: await EmailTemplate.fetchSubjectTemplate(15),
            application_name: "FinVal",
            text: "",
            html: html
          });
        } else {
          let html = await EmailTemplate.reportSubmitWithoutDocument(formattedDueDate, user.first_name, order.business.companyName, process.env.CONTACTEMAIL);
          let result = await EmailTemplate.sendMail({
            email: user.email,
            subject: await EmailTemplate.fetchSubjectTemplate(4),
            application_name: "FinVal",
            text: "",
            html: html
          });
        }
      }

      return res.status(200).json({ 'status': true, 'message': newMessage, 'data': [] });
    });

  } catch (error) {
    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
  }
});

module.exports = router;
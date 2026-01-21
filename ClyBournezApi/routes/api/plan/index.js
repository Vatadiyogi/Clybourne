const router = require("express").Router();
const express = require("express");
const moongose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const fs = require('fs');
const path = require('path');
// const { jsPDF } = require("jspdf");
const Plan = require("../../../models/plan.model");
const PlanRecord = require("../../../models/plan-record.model");
const Transaction = require("../../../models/transactions.model");
const { validate } = require("./../../../middleware/authorizations.middleware");
const { check, validationResult } = require("express-validator");
const CustomersModel = require("../../../models/customers.model");
const StripeResponseModel = require("../../../models/stripe-response.model");
const StripeRecoredModel = require("../../../models/stripe-record.model");
const EmailTemplate = require("../../../email/sendMail");
// const {jsPDF} = require('jspdf');
const stripe = require("stripe")(process.env.STRIPE_KEY);
// const { generateInvoicePDF } = require('../../../utils/invoiceGenerator');
// const endpointSecret = "whsec_3329299825de714464f79f73442b69b6199076b471b039300ceea7c1b30798d3";
//  // Replace with your CLI webhook secret
const endpointSecret = process.env.WEBHOOK_CLI
// Add this after other imports
const cron = require('node-cron');
// ==================== AUTOMATIC CRON JOB FUNCTION ====================
async function autoGenerateInvoices() {
  try {
    console.log('='.repeat(60));
    console.log('🤖 AUTOMATIC CRON JOB STARTED - Invoice Generation');
    console.log('⏰ Time:', new Date().toLocaleString());
    console.log('='.repeat(60));

    // Find expired plans without invoices
    const planrecords = await PlanRecord.find({
      planStatusType: 'expired',
      invoiceSent: { $ne: 1 } // Not equal to 1
    }).populate('planId');

    console.log(`🔍 Found ${planrecords.length} expired plans without invoices\n`);

    let processedCount = 0;
    let failedCount = 0;

    if (planrecords.length > 0) {
      for (const plan of planrecords) {
        try {
          console.log(`📋 Processing: ${plan.planSeqId}`);

          // Get user
          const user = await CustomersModel.findById(plan.userId);
          if (!user) {
            console.log(`   ❌ User not found`);
            failedCount++;
            continue;
          }

          // Get transaction
          const transaction = await Transaction.findOne({
            customerId: plan.userId,
            planSeqId: plan.planSeqId
          });

          console.log(`   👤 Customer: ${user.email}`);
          console.log(`   📄 Plan: ${plan.planId?.name || 'N/A'}`);

          // Generate PDF
          const invoicePath = await generateInvoicePDF(plan, user, transaction);
          console.log(`   📄 Generated: ${invoicePath}`);

          // Update database
          await PlanRecord.updateOne(
            { _id: plan._id },
            {
              $set: {
                invoiceSent: 1,
                invoicePath: invoicePath,
                updatedAt: new Date()
              }
            }
          );

          console.log(`   ✅ Updated database\n`);
          processedCount++;

        } catch (error) {
          console.error(`   ❌ Error: ${error.message}\n`);
          failedCount++;
        }
      }
    } else {
      console.log(`✅ No pending invoices to generate\n`);
    }

    console.log('='.repeat(60));
    console.log('📊 CRON JOB COMPLETED');
    console.log(`   ✅ Processed: ${processedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   📋 Total found: ${planrecords.length}`);
    console.log('='.repeat(60));

    return { processedCount, failedCount, total: planrecords.length };

  } catch (error) {
    console.error('💥 Auto Cron Job Error:', error);
    throw error;
  }
}

// Schedule to run daily at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Scheduled cron job triggered at:', new Date().toLocaleString());
  console.log('🕒 Time: 12:00 AM (Midnight)');
  await autoGenerateInvoices();
});

console.log('✅ Automatic cron job scheduled: Daily at midnight (00:00)')

router.post("/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
     console.log("webhook events", req.body )
    let event;

    try {
      const sig = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // ✅ Store raw event in your DB for debugging
      await StripeResponseModel.create({ event_response: event });

      switch (event.type) {
        case "checkout.session.completed":
          const checkout = event.data.object;

          if (checkout) {
            const sessionRecord = await StripeRecoredModel.findOne({
              sessionId: checkout.id,
            });

            if (
              sessionRecord &&
              sessionRecord.selectedPlanType === "new"
            ) {
              await savePlan(sessionRecord, checkout);
            }

            if (
              sessionRecord &&
              sessionRecord.selectedPlanType === "upgrade"
            ) {
              await upgradePlan(sessionRecord, checkout);
            }
          }
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Error handling webhook:", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  }
);
// stripe listen --forward-to http://localhost:5050/api/plan/webhook

// Get all plans
router.get("/", async (req, res) => {
  try {
    // Fetch the plans from the database
    let plans = await Plan.find({ status: 1 }).sort({ displaySequence: 1 });

    // Initialize grouped objects
    let groupedPlans = {
      typeA: [],
      others: []
    };

    // Group the plans based on planType
    plans.forEach(plan => {
      if (plan.planType === "A") {
        groupedPlans.typeA.push(plan);
      } else {
        groupedPlans.others.push(plan);
      }
    });

    // Send the response
    return res.status(200).json({
      status: true,
      message: "Success: Plan Fetched",
      data: groupedPlans
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      status: false,
      message: error.message,
      data: []
    });
  }
});
router.get("/test_plan_error", async (req, res) => {
  try {
    const record = await PlanRecord.findOne().populate("planId");
    return res.json({ status: true, data: record });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
});
// Get all customers plans
router.get("/customer_plans", async (req, res) => {
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

      // ⭐ ADD THIS: Auto-update expired plans in database
      const today = new Date();
      await PlanRecord.updateMany(
        {
          userId: decoded.userId,
          planStatusType: { $in: ['active', 'completed'] },
          expiresAt: { $lt: today }
        },
        {
          $set: {
            planStatusType: 'expired',
            invoiceSent: 0 // Reset to 0 so cron job can send invoice
          }
        }
      );

      // Your existing code continues...
      let current_plan;
      current_plan = await PlanRecord.findOne({
        userId: decoded.userId,
        planStatusType: 'active'
      }).populate('planId').sort({ createdAt: -1 });

      if (!current_plan) {
        current_plan = await PlanRecord.findOne({
          userId: decoded.userId,
          planStatusType: { $ne: 'queued' }
        }).populate('planId').sort({ createdAt: -1 });

        if (current_plan && current_plan.planStatusType !== 'completed') {
          current_plan = null;
        }
      }

      // 🔄 MINIMAL ADDITION: Check expiry for current_plan
      // const today = new Date();
      let currentPlanData = null;

      if (current_plan) {
        currentPlanData = current_plan.toObject();

        // Check if plan is expired based on expiresAt
        if (currentPlanData.expiresAt) {
          const expiryDate = new Date(currentPlanData.expiresAt);
          if (expiryDate < today) {
            // Mark as expired only for display
            currentPlanData.displayStatus = 'expired';
          }
        }

        const totalDays = currentPlanData.planId?.accessDays || 0;
        const purchaseDate = new Date(currentPlanData.createdAt);
        const utilizedDays = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
        const remainingDays = totalDays - utilizedDays;

        currentPlanData.utilizedDays = utilizedDays < 0 ? 0 : utilizedDays;
        currentPlanData.remainingDays = remainingDays < 0 ? 0 : remainingDays;
        currentPlanData.totalDays = totalDays;
      }

      // Get old plans - your existing logic
      const old_plans_raw = await PlanRecord.find({ userId: decoded.userId })
        .populate('planId')
        .sort({ createdAt: 1 });

      // 🔄 MINIMAL ADDITION: Add expiry check for each plan
      const old_plans = old_plans_raw.map(plan => {
        const planObj = plan.toObject();

        // Add expiry check without modifying original status
        if (planObj.expiresAt) {
          const expiryDate = new Date(planObj.expiresAt);
          if (expiryDate < today && (planObj.planStatusType === 'active' || planObj.planStatusType === 'completed')) {
            // Add a display field that doesn't override original data
            planObj.displayStatus = 'expired';
          }
        }
        return planObj;
      });

      const plans_history = await Transaction.find({ customerId: decoded.userId })
        .populate('planId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        message: "Success: Customer Plan Fetched",
        data: {
          current_plan: currentPlanData,
          old_plans,
          plans_history
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});

// Get Customer Upgrade Plans
router.get("/customer_upgrade_plans", validate, async (req, res) => {
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
      const current_plan = await PlanRecord.find({
        userId: decoded.userId,
        planStatusType: { $in: ['completed', 'active'] },
        expiresAt: { $gt: new Date() }
      })
        .populate('planId')
        .sort({ createdAt: -1 });

      let upgrade_data = []
      if (current_plan) {
        // Check if Upgrade Option is available
        upgrade_data = await getUpgradeData(current_plan[0]);
      }

      return res.status(200).json({ status: true, message: "Success: Transactions Fetched", data: { 'current_plan': current_plan, 'upgrade_data': upgrade_data } });
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});

// Get all customers plan transactions
router.get("/customer_plans_transaction/", validate, async (req, res) => {
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

      let plan = await Transaction.find({ customerId: decoded.userId }).populate('planId').sort({ createdAt: -1 });
      return res.status(200).json({ status: true, message: "Success: Transactions Fetched", data: { plan } });
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});

// router.get("/cron-plans", async (req, res) => {
//   try {
//     // Fetch active and completed plans whose expiry date is <= current date
//     const planrecords = await PlanRecord.find({
//       planStatusType: { $in: ['active', 'completed'] },
//       expiresAt: { $lte: moment().format() }
//     });

//     if (planrecords.length) {
//       for (const plan of planrecords) {
//         // Read and prepare the invoice HTML template
//         const templatePath = path.join(__dirname, '../../../template/invoice.html');
//         let invoiceTemplate = await fs.readFile(templatePath, 'utf-8'); // FIXED

//         let user = await CustomersModel.findOne({ '_id': plan.userId });

//         // Replace placeholders in the HTML template with actual data
//         invoiceTemplate = invoiceTemplate
//           .replace('{{userName}}', user.first_name + ' ' + user.last_name)
//           .replace('{{planName}}', plan.planType)
//           .replace('{{amount}}', plan.amount)
//           .replace('{{totalAmount}}', plan.amount)
//           .replace('{{userEmail}}', user.email)
//           .replace('{{invoiceDate}}', moment().format('DD-MMM-yyyy'));

//         // Define options for HTML2PDF
//         const pdfPath = path.join(__dirname, `../../../uploads/invoices/invoice_${plan._id}.pdf`);
//         const options = {
//           format: 'A4',
//           filePath: pdfPath,
//           landscape: false,
//           resolution: {
//             height: 1920,
//             width: 1080,
//           },
//         };

//         // Create PDF using html2pdf.createPDF()
//         await html2pdf.createPDF(invoiceTemplate, options); // FIXED
//         console.log('PDF Generated:', pdfPath);

//         // Generate the PDF and save it to the specified path
//           format: 'A4', // Page format
//           printBackground: true // Print background colors
//         });

//         await browser.close(); // Close the browser after PDF is generated

//         return res.status(200).json({ status: true, message: pdfPath });

//         let html = await EmailTemplate.invoiceSent(user.first_name, plan.planSeqId, moment(plan.createdAt).format('DD-MMM-YYYY'));
//         let result = await EmailTemplate.sendMail({
//           email: user.email,
//           subject: await EmailTemplate.fetchSubjectTemplate(13),
//           application_name: "FinVal",
//           text: "",
//           html: html,
//           attachments: [
//             {
//               filename: `invoice_${plan._id}.pdf`,
//               path: pdfPath,
//             },
//           ],
//         });

//         // Mark the plan as expired
//         await PlanRecord.updateOne({ _id: plan._id }, {
//           $set: {
//             planStatusType: 'expired',
//             invoicePath: pdfPath
//           }
//         });

//         // Remove active plan details from customer
//         await CustomersModel.updateOne({ _id: plan.userId }, {
//           $set: {
//             activePlanId: null,
//             activePlanSeqId: null,
//             activePlanType: null,
//             activePlanExpiryDate: null,
//           }
//         });

//         // Activate the oldest queued plan
//         const queued_plan = await PlanRecord.find({ userId: plan.userId, planStatusType: 'queued' })
//           .sort({ createdAt: 1 })
//           .limit(1);

//         if (queued_plan.length > 0) {
//           const accessDays = queued_plan[0].accessDays;
//           const newStartDate = moment().format();
//           const newExpiryDate = moment().add(accessDays, 'days').format();

//           await PlanRecord.updateOne({ _id: queued_plan[0]._id }, {
//             $set: {
//               startAt: newStartDate,
//               expiresAt: newExpiryDate,
//               activatedAt: newStartDate,
//               planStatusType: 'active'
//             }
//           });

//           await CustomersModel.updateOne({ _id: queued_plan[0].userId }, {
//             $set: {
//               activePlanId: queued_plan[0].planId,
//               activePlanSeqId: queued_plan[0].planTxnId,
//               activePlanType: queued_plan[0].planType,
//               activePlanExpiryDate: newExpiryDate,
//             }
//           });
//         }
//       }
//     }

//     return res.status(200).json({ status: true, message: "Cron job executed successfully" });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Server error", error: error.message });
//   }
// });


// Get a specific plan




// Add at the top with other imports:

// Manual trigger route (for testing/admin)
router.get("/cron-send-invoice", async (req, res) => {
  try {
    console.log('🔄 Manual cron job triggered by admin');

    const result = await autoGenerateInvoices();

    return res.status(200).json({
      status: true,
      message: "Invoice generation completed",
      data: result
    });

  } catch (error) {
    console.error('💥 Error:', error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
});

// Professional invoice download route
// Professional invoice download route
router.get("/download-invoice/:planSeqId", async (req, res) => {
  try {
    const planSeqId = parseInt(req.params.planSeqId);

    console.log(`📥 Download request for Plan: ${planSeqId}`);

    // 1. Find the plan
    const plan = await PlanRecord.findOne({ planSeqId })
      .populate('planId');

    if (!plan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    // 2. Check if invoice exists
    if (!plan.invoiceSent || plan.invoiceSent !== 1) {
      return res.status(404).json({
        status: false,
        message: "Invoice not generated yet",
        instructions: "Invoice is generated automatically when plan expires. Please wait or use manual trigger."
      });
    }

    // 3. Check if invoicePath exists
    if (!plan.invoicePath) {
      return res.status(404).json({
        status: false,
        message: "Invoice file path missing",
        instructions: "Invoice was marked as sent but file path is missing. Please contact support."
      });
    }

    // 4. Build the absolute path
    const baseDir = path.join(__dirname, '../../public');
    let absolutePath;

    // Handle different path formats
    if (plan.invoicePath.startsWith('/')) {
      absolutePath = path.join(baseDir, plan.invoicePath);
    } else if (plan.invoicePath.includes('invoices/')) {
      absolutePath = path.join(baseDir, plan.invoicePath);
    } else {
      absolutePath = path.join(baseDir, 'invoices', plan.invoicePath);
    }

    console.log(`📄 Looking for invoice at: ${absolutePath}`);

    // 5. Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(absolutePath)) {
      console.log(`❌ Invoice file not found. Regenerating...`);

      // Get user and transaction
      const user = await CustomersModel.findById(plan.userId);
      const transaction = await Transaction.findOne({
        customerId: plan.userId,
        planSeqId: plan.planSeqId
      });

      if (!user || !transaction) {
        return res.status(404).json({
          status: false,
          message: "Cannot regenerate invoice - missing user or transaction data"
        });
      }

      // Regenerate the invoice
      const newInvoicePath = await generateInvoicePDF(plan, user, transaction);
      const newAbsolutePath = path.join(baseDir, newInvoicePath);

      // Update the plan
      await PlanRecord.updateOne(
        { _id: plan._id },
        {
          $set: {
            invoicePath: newInvoicePath,
            updatedAt: new Date()
          }
        }
      );

      absolutePath = newAbsolutePath;
      console.log(`✅ Invoice regenerated at: ${absolutePath}`);
    }

    // 6. Send the file
    const filename = `Invoice_${plan.planSeqId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    res.sendFile(absolutePath);

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      status: false,
      message: "Error downloading invoice",
      error: error.message
    });
  }
});
// Manual invoice generation for single plan
router.get("/generate-invoice/:planSeqId", async (req, res) => {
  try {
    const planSeqId = parseInt(req.params.planSeqId);

    console.log(`🔄 Manual invoice generation for Plan: ${planSeqId}`);

    // 1. Find the plan
    const plan = await PlanRecord.findOne({ planSeqId }).populate('planId');

    if (!plan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found"
      });
    }

    // 2. Check if plan is expired
    const isExpired = plan.planStatusType === 'expired' ||
      (plan.expiresAt && new Date(plan.expiresAt) < new Date());

    if (!isExpired) {
      return res.status(400).json({
        status: false,
        message: "Invoice can only be generated for expired plans"
      });
    }

    // 3. Check if invoice already exists
    if (plan.invoiceSent === 1 && plan.invoicePath) {
      return res.status(200).json({
        status: true,
        message: "Invoice already exists",
        data: { invoicePath: plan.invoicePath }
      });
    }

    // 4. Get user and transaction
    const user = await CustomersModel.findById(plan.userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    const transaction = await Transaction.findOne({
      customerId: plan.userId,
      planSeqId: plan.planSeqId
    });

    // 5. Generate PDF
    console.log(`📄 Generating invoice for plan ${planSeqId}...`);
    const invoicePath = await generateInvoicePDF(plan, user, transaction);

    // 6. Update database
    await PlanRecord.updateOne(
      { _id: plan._id },
      {
        $set: {
          invoiceSent: 1,
          invoicePath: invoicePath,
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Invoice generated: ${invoicePath}`);

    return res.status(200).json({
      status: true,
      message: "Invoice generated successfully",
      data: { invoicePath }
    });

  } catch (error) {
    console.error('❌ Manual invoice generation error:', error);
    return res.status(500).json({
      status: false,
      message: "Failed to generate invoice",
      error: error.message
    });
  }
});
function generatePDF(plan, user, transaction, filePath) {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = require('pdfkit');
      const fs = require('fs');

      // Create directory if it doesn't exist
      const dir = require('path').dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create PDF document
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true
      });

      // Create write stream
      const stream = fs.createWriteStream(filePath);

      // Pipe the PDF to the file
      doc.pipe(stream);

      // ==================== INVOICE HEADER ====================
      // Company Logo/Header
      doc.fillColor('#4CAF50')
        .rect(50, 50, 500, 80)
        .fill();

      doc.fillColor('#FFFFFF')
        .fontSize(30)
        .text('INVOICE', 60, 70);

      doc.fontSize(12)
        .text(`Invoice #: INV-${plan.planSeqId}-${Date.now()}`, 60, 115)
        .text(`Date: ${new Date().toLocaleDateString()}`, 60, 130);

      // Company Info
      doc.fillColor('#fff')
        .fontSize(10)
        .text('FinVal', 400, 70)
        .text('123 Business Street', 400, 85)
        .text('+1 234 567 8900', 400, 130);

      // ==================== BILL TO ====================
      doc.moveDown(5);
      const billToY = doc.y;

      doc.fillColor('#000000')
        .fontSize(14)
        .text('BILL TO:', 50, billToY, { underline: true });

      doc.fontSize(11)
        .text(`${user.first_name || ''} ${user.last_name || ''}`, 50, billToY + 25)
        .text(user.email, 50, billToY + 45)
        .text(`Customer ID: ${user._id.toString()}`, 50, billToY + 65);

      // ==================== PLAN DETAILS TABLE ====================
      doc.moveDown(4);
      const detailsY = doc.y;

      // Table Header
      doc.fillColor('#4CAF50')
        .rect(50, detailsY, 500, 25)
        .fill();

      doc.fillColor('#FFFFFF')
        .fontSize(11)
        .text('Description', 55, detailsY + 7)
        .text('Details', 300, detailsY + 7);

      // Plan Details Rows
      const details = [
        { label: 'Plan Name', value: plan.planId?.name || 'Plan Subscription' },
        { label: 'Plan ID', value: plan.planSeqId },
        { label: 'Plan Type', value: plan.planType },
        { label: 'Reports Included', value: plan.balanceQuota || 0 },
        { label: 'Access Days', value: plan.accessDays || 0 },
        { label: 'Purchase Date', value: new Date(plan.createdAt).toLocaleDateString() },
        { label: 'Expiry Date', value: new Date(plan.expiresAt).toLocaleDateString() },
        { label: 'Status', value: plan.planStatusType || 'Expired' }
      ];

      let rowY = detailsY + 30;
      details.forEach((detail, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
          doc.fillColor('#F9F9F9')
            .rect(50, rowY, 500, 25)
            .fill();
        }

        doc.fillColor('#000000')
          .fontSize(10)
          .text(detail.label, 55, rowY + 8)
          .text(detail.value.toString(), 300, rowY + 8);

        rowY += 25;
      });

      // ==================== PAYMENT SUMMARY ====================
      doc.moveDown(details.length + 1);
      const paymentY = doc.y;

      // Payment box
      doc.fillColor('#F0F0F0')
        .rect(350, paymentY, 200, 100)
        .fill();

      doc.fillColor('#000000')
        .fontSize(14)
        .text('PAYMENT SUMMARY', 360, paymentY + 15, { underline: true });

      doc.fontSize(12)
        .text('Amount:', 360, paymentY + 40)
        .text(`$${plan.amount || 0}.00`, 460, paymentY + 40, { align: 'right' });

      doc.fontSize(10)
        .text('Status: Paid', 360, paymentY + 65)
        .text(`Method: ${transaction?.gatewayType || 'Online'}`, 360, paymentY + 80);

      if (transaction?.txnId) {
        doc.fontSize(9)
          .fillColor('#666666')
          .text(`TXN: ${transaction.txnId.substring(0, 20)}...`, 360, paymentY + 95);
      }

      // ==================== FOOTER ====================



      // Finalize PDF
      doc.end();

      // Handle stream events
      stream.on('finish', () => {
        console.log('PDF stream finished');
        resolve();
      });

      stream.on('error', (error) => {
        console.error('PDF stream error:', error);
        reject(error);
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
}
// ==================== GENERATE INVOICE PDF FUNCTION ====================
async function generateInvoicePDF(plan, user, transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      const timestamp = Date.now();
      const filename = `invoice_${plan.planSeqId}_${timestamp}.pdf`;
      const relativePath = `invoices/${filename}`;
      const fullPath = path.join(__dirname, '../../public', relativePath);

      // Ensure directory exists
      const fs = require('fs');
      const invoicesDir = path.dirname(fullPath);
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      // Generate the PDF
      await generatePDF(plan, user, transaction, fullPath);

      // Return relative path for database storage
      resolve(relativePath);
    } catch (error) {
      console.error('Invoice generation error:', error);
      reject(error);
    }
  });
}
router.get("/cron-results", async (req, res) => {
  try {
    // Get recently processed plans (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const processedPlans = await PlanRecord.find({
      invoiceSent: 1,
      updatedAt: { $gte: twentyFourHoursAgo }
    })
      .populate('planId')
      .sort({ updatedAt: -1 });

    // Get pending plans (expired but invoice not sent)
    const pendingPlans = await PlanRecord.find({
      planStatusType: 'expired',
      invoiceSent: 0
    })
      .populate('planId')
      .sort({ expiresAt: 1 });

    // Get all expired plans
    const allExpiredPlans = await PlanRecord.find({
      planStatusType: 'expired'
    })
      .populate('planId')
      .sort({ expiresAt: 1 });

    return res.status(200).json({
      status: true,
      message: "Cron job results",
      data: {
        recentlyProcessed: {
          count: processedPlans.length,
          plans: processedPlans.map(p => ({
            planId: p._id,
            planSeqId: p.planSeqId,
            planName: p.planId?.name,
            userEmail: "hidden",
            invoicePath: p.invoicePath,
            processedAt: p.updatedAt,
            expiresAt: p.expiresAt
          }))
        },
        pendingInvoices: {
          count: pendingPlans.length,
          plans: pendingPlans.map(p => ({
            planId: p._id,
            planSeqId: p.planSeqId,
            planName: p.planId?.name,
            expiredOn: p.expiresAt,
            daysSinceExpiry: Math.floor((new Date() - new Date(p.expiresAt)) / (1000 * 60 * 60 * 24))
          }))
        },
        summary: {
          totalExpiredPlans: allExpiredPlans.length,
          invoicesSent: processedPlans.length,
          pendingInvoices: pendingPlans.length,
          successRate: allExpiredPlans.length > 0
            ? Math.round((processedPlans.length / allExpiredPlans.length) * 100)
            : 0
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch cron results",
      error: error.message
    });
  }
});

router.get("/invoices-list", async (req, res) => {
  try {
    const invoicesDir = path.join(__dirname, '../../public/invoices');

    // Check if directory exists
    try {
      await fs.access(invoicesDir);
    } catch {
      return res.status(200).json({
        status: true,
        message: "Invoices directory doesn't exist yet",
        data: { files: [], count: 0 }
      });
    }

    // Read directory
    const files = await fs.readdir(invoicesDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    // Get file details
    const fileDetails = await Promise.all(
      pdfFiles.map(async (file) => {
        const filePath = path.join(invoicesDir, file);
        const stats = await fs.stat(filePath);
        return {
          filename: file,
          path: `/invoices/${file}`,
          size: `${(stats.size / 1024).toFixed(2)} KB`,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
    );

    // Sort by most recent
    fileDetails.sort((a, b) => b.modified - a.modified);

    return res.status(200).json({
      status: true,
      message: "Invoice files list",
      data: {
        directory: invoicesDir,
        count: fileDetails.length,
        files: fileDetails
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to list invoices",
      error: error.message
    });
  }
});

// ============================================
// CHECK PROCESSED PLANS ROUTE
// ============================================

router.get("/check-processed-plans", async (req, res) => {
  try {
    // Get the 4 plans that were just processed
    const processedPlans = await PlanRecord.find({
      invoiceSent: 1
    })
      .sort({ updatedAt: -1 })
      .limit(4)
      .populate('planId');

    return res.status(200).json({
      status: true,
      message: "Recently processed plans",
      data: processedPlans.map(plan => ({
        id: plan._id,
        planSeqId: plan.planSeqId,
        planName: plan.planId?.name,
        planStatusType: plan.planStatusType,
        invoiceSent: plan.invoiceSent,
        invoicePath: plan.invoicePath,
        expiresAt: plan.expiresAt,
        updatedAt: plan.updatedAt,
        hasInvoiceFile: !!plan.invoicePath
      }))
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to check processed plans",
      error: error.message
    });
  }
});
router.get("/:planId", async (req, res) => {
  try {
    let plan = await Plan.findById({ _id: req.params.planId });
    const current_date = moment().format();
    plan.expiresAt = moment(current_date).add(plan.accessDays, 'days');
    return res.status(200).json({ status: true, message: "Success: Plan Fetched", data: { plan } });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});


async function savePlan(sessionRecord = {}, checkout = {}) {
  const user = await CustomersModel.findById({ _id: sessionRecord.userId });
  if (user) {
    // Check if user has an active plan
    let userHasPlan = (user.activePlanId === null) ? true : false;
    const plan = await Plan.findById({ _id: sessionRecord.planId });

    // Find the latest PlanRecord for the user to get the latest planSeqId
    const latestPlanRecord = await PlanRecord.findOne({ userId: user._id }).sort({ planSeqId: -1 });
    let planSeqId = latestPlanRecord ? (latestPlanRecord.planSeqId || 0) + 1 : 1;

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

    const planRecord = new PlanRecord({
      userId: user._id,
      planId: plan._id,
      planTxnId: plan.sequenceId,
      planType: plan.planType,
      planSeqId: planSeqId,
      amount: sessionRecord.planPrice,
      orderType: sessionRecord.selectedPlanType,
      accessDays: sessionRecord.accessDays,
      startAt: moment().format(),
      expiresAt: (isPlanExpired == true) ? moment().add(sessionRecord.accessDays, 'days') : (userHasPlan ? moment().add(sessionRecord.accessDays, 'days') : null),
      balanceQuota: sessionRecord.totalReports,
      planStatusType: (isPlanExpired == true) ? 'active' : ((userHasPlan == true) ? 'active' : 'queued'),
    });

    if (await planRecord.save()) {
      // Save transactions
      const transaction = new Transaction({
        orderId: sessionRecord.transactionId,
        email: user.email,
        customerId: user._id,
        country: user.country,
        planId: plan._id,
        planSeqId: plan.sequenceId,
        planType: plan.planType,
        orderType: "New",
        reportCount: sessionRecord.totalReports,
        amount: sessionRecord.planPrice,
        gatewayType: 'Stripe Card',
        txnId: checkout.payment_intent,
        status: "Success",
        message: checkout.payment_status,
      });

      await transaction.save();

      // Check if user has an active plan
      // Update user, if new plan is purchased
      user.activePlanId = plan._id;
      user.activePlanSeqId = plan.sequenceId;
      user.activePlanType = plan.planType;
      user.activePlanExpiryDate = moment().add(sessionRecord.accessDays, 'days');
      await user.save();

      await StripeRecoredModel.updateOne({ sessionId: sessionRecord._id }, {
        $set: {
          transactionStatus: checkout.payment_status
        }
      });

      let html = await EmailTemplate.newPlanPurchase(sessionRecord.planPrice, user.first_name, process.env.BASEURL);
      let result = await EmailTemplate.sendMail({
        email: user.email,
        subject: await EmailTemplate.fetchSubjectTemplate(10),
        application_name: "FinVal",
        text: "",
        html: html
      });

      return { status: true, message: "Plan purchased successfully." };
    }
  }
  return { status: false, message: "Failed to purchase plan." };
}

async function upgradePlan(sessionRecord = {}, checkout = {}) {
  try {
    const user = await CustomersModel.findById({ _id: sessionRecord.userId });
    if (user) {
      const plan = await Plan.findById({ _id: sessionRecord.planId });
      const prevPlanId = user.activePlanSeqId;
      let existingPlan;

      // Check previous active plan, and mark inactive
      if (user.activePlanId !== null) {
        // let existingPlan = await PlanRecord.findOne({ userId: user._id, planStatusType: 'active' });
        existingPlan = await PlanRecord.findOne({
          userId: user._id,
          planStatusType: { $in: ['completed', 'active'] },
          expiresAt: { $gt: new Date() }
        });

        if (existingPlan) {
          existingPlan.expiresAt = null;
          existingPlan.planStatusType = 'inactive';
          await existingPlan.save();  // Mark the current plan as inactive
        }
      }

      // Find the latest PlanRecord for the user to get the latest planSeqId
      const latestPlanRecord = await PlanRecord.findOne({ userId: user._id }).sort({ planSeqId: -1 });
      let planSeqId = latestPlanRecord ? (latestPlanRecord.planSeqId || 0) + 1 : 1;

      // Save plan record, and make upgrade plan active
      const planRecord = new PlanRecord({
        userId: user._id,
        planId: plan._id,
        planTxnId: plan.sequenceId,
        planType: plan.planType,
        planSeqId: planSeqId,
        amount: sessionRecord.planPrice,
        orderType: sessionRecord.selectedPlanType,
        accessDays: sessionRecord.accessDays,
        startAt: moment().format(),
        expiresAt: moment().add(sessionRecord.accessDays, 'days'),
        balanceQuota: sessionRecord.totalReports,
        planStatusType: 'active',
        activatedAt: moment().format(),
        upgradedFromPlanId: existingPlan && existingPlan.orderType === 'new' ? existingPlan._id : existingPlan.upgradedFromPlanId
      });

      await planRecord.save();

      // Save transaction
      const transaction = new Transaction({
        orderId: sessionRecord.transactionId,
        email: user.email,
        customerId: user._id,
        country: user.country,
        planId: plan._id,
        planSeqId: plan.sequenceId,
        planType: plan.planType,
        orderType: "Upgrade",
        reportCount: sessionRecord.totalReports,
        amount: sessionRecord.planPrice,
        gatewayType: 'Stripe Card',
        txnId: checkout.payment_intent,
        status: "Success",
        message: checkout.payment_status,
      });

      await transaction.save();

      // Update user, if plan is upgraded
      user.activePlanId = plan._id;
      user.activePlanSeqId = plan.sequenceId;
      user.activePlanType = plan.planType;
      user.activePlanExpiryDate = moment().add(sessionRecord.accessDays, 'days');
      await user.save();

      // send an email for plan upgrade
      let html = await EmailTemplate.planUpgrade(sessionRecord.planPrice, user.first_name, plan.balanceQuota, plan.accessDays, plan.price, prevPlanId, plan.sequenceId, sessionRecord.totalReports, sessionRecord.accessDays, moment().add(sessionRecord.accessDays, 'days'));
      let result = await EmailTemplate.sendMail({
        email: user.email,
        subject: await EmailTemplate.fetchSubjectTemplate(7),
        application_name: "FinVal",
        text: "",
        html: html
      });
    }

    return { status: true, message: "Plan Update successfully." };
  } catch (error) {
    console.error('Error saving record:', error);
    return { status: false, message: "Failed to upgrade plan." };
  }
}

async function getUpgradeData(currentPlan) {
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
      const upgradeBOPlan = await Plan.findOne({ planType: "BOP", status: 1, isDeleted: 0 });
      if (upgradeBOPlan) {
        return calculateUpgradeDetails(upgradeBOPlan, currentPlan);
      }
    }

    // Handle "A" plan upgrades
    if (currentPlanType === "A") {
      const currentPlanReport = currentPlan.balanceQuota - currentPlan.orders.length;

      // Fetch all potential upgrade plans where reports are greater than current plan's report
      const upgradePlans = await Plan.find({
        planType: "A",
        status: 1,
        isDeleted: 0,
        reports: { $gt: currentPlanReport } // Find plans with more reports than current plan
      }).sort({ reports: 1 }); // Sort by reports in ascending order (lowest first)

      // Map over upgradePlans and calculate upgrade details for each
      const upgradeDataList = upgradePlans.map(upgradePlan =>
        calculateUpgradeDetails(upgradePlan, currentPlan)
      );

      return upgradeDataList.length > 0 ? upgradeDataList : null; // Return the upgrade data or null if no plans found
    }

    // If no upgrade plan is found, return null
    return null;

  } catch (error) {
    console.error("Error fetching upgrade data:", error.message);
    return null; // Return null in case of an error
  }
}

router.post('/test_webhook', async (req, res) => {
  try {
    const stripe_response = await StripeResponseModel.findOne({ _id: "66f671bb5d99590a40832730" });
    const event = stripe_response.event_response;

    switch (event.type) {
      case 'checkout.session.completed':
        const checkout = event.data.object;
        if (checkout && checkout.metadata.order_id) {
          const sessionRecord = await StripeRecoredModel.findOne({ transactionId: parseInt(checkout.metadata.order_id) });
          if (sessionRecord && sessionRecord.selectedPlanType && sessionRecord.selectedPlanType === 'new') {
            await savePlan(sessionRecord, checkout);
          }

          if (sessionRecord && sessionRecord.selectedPlanType && sessionRecord.selectedPlanType === 'upgrade') {
            await upgradePlan(sessionRecord, checkout);
          }
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // return res.status(200).json({ received: true });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;


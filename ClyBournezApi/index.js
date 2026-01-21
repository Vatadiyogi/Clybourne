const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const axios = require('axios');
const path = require('path');
require('dotenv').config();


// Add at the end of server.js
require('./cronJobs');
const MONGODB = process.env.MONGODB_URI;
const port = process.env.PORT;

// CORS
app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
  credentials: true
}));
app.use(
  "/assets",
  express.static(path.join(process.cwd(), "public/assets"))
);
app.get("/", (req, res) => {
  res.send("✅ Server is running fine!");
});
// ⚠️ IMPORTANT – webhook must be BEFORE json parser
app.use('/api/plan/webhook', express.raw({ type: 'application/json' }));

// Normal body parsers for all other routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/invoices', express.static(path.join(__dirname, 'public/invoices')));// Example route
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the Backend!" });
});
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("valuation-report");
});

////////////////////////// ROUTES /////////////////////////////////////

// Route for getting country information
app.use('/api/country', require('./routes/api/country'));

// Authentication
app.use('/api/auth', require('./routes/api/auth'));

// Queries CRUD
app.use('/api/queries', require('./routes/api/queries'));

// ⚠️ IMPORTANT – plan route now works because webhook is ABOVE
app.use('/api/plan', require('./routes/api/plan'));

// Payment
app.use('/api/payments', require('./routes/api/payment'));

// Front-end

app.use('/api/front', require('./routes/api/front/'));
app.use('/api/stripe', require('./routes/api/front/stripe'));
app.use('/api/order', require('./routes/api/front/order'));
app.use('/api/enquiry', require('./routes/api/front/contactRoutes'));
const reportRoutes = require('./routes/api/front/reportRoutes');
// Add with your other routes (usually after auth middleware)
app.use('/api/reports', reportRoutes);
// In your server.js file
app.use('/api/razorpay', require('./routes/api/front/razorpay'));
////////////////////////// ADMIN ROUTES /////////////////////////////////////
app.use('/api/admin/setup', require('./routes/api/admin/setup/setup'));
app.use('/api/admin/holiday', require('./routes/api/admin/setup/holiday'));
app.use('/api/admin/plan', require('./routes/api/admin/setup/plan'));
app.use('/api/admin/admin', require('./routes/api/admin/adminUsers'));
app.use('/api/admin/customer', require('./routes/api/admin/customers'));
app.use('/api/admin/transaction', require('./routes/api/admin/transaction'));
app.use('/api/admin/orders', require('./routes/api/admin/orders'));
app.use('/api/admin/email', require('./routes/api/admin/email'));
app.use('/api/admin/industry', require('./routes/api/admin/industry'));
app.use('/api/admin/subindustry', require('./routes/api/admin/subindustry'));
app.use('/api/admin/currency', require('./routes/api/admin/currency'));
////////////////////////// ADMIN ROUTES //////////////////////////////////

// Test
app.use('/test', require('./Payment/index'));

// ============================================
// 📅 AUTO-INVOICE CRON JOB SETUP
// ============================================

// Function to run the invoice cron job
// async function runInvoiceCronJob() {
//   const timestamp = new Date().toISOString();
//   console.log(`\n🔄 [${timestamp}] Running invoice cron job...`);

//   try {
//     // Call your own cron-send-invoice endpoint
//     const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
//     const response = await axios.get(`${baseUrl}/api/plan/cron-send-invoice`);

//     console.log(`✅ [${timestamp}] Cron job completed successfully`);
//     console.log(`📊 Response:`, response.data);

//     return response.data;
//   } catch (error) {
//     console.error(`❌ [${timestamp}] Cron job failed:`);
//     console.error(`   Error: ${error.message}`);

//     if (error.response) {
//       console.error(`   Status: ${error.response.status}`);
//       console.error(`   Data:`, error.response.data);
//     }

//     throw error;
//   }
// }

// // Schedule the cron job
// function scheduleCronJobs() {
//   // 🕛 OPTION A: Run daily at midnight (Production)
//   cron.schedule('0 0 * * *', runInvoiceCronJob);
//   console.log('📅 Cron job scheduled: Daily at midnight (00:00)');

//   // 🧪 OPTION B: For testing - run every 30 minutes (optional)
//   if (process.env.NODE_ENV === 'development') {
//     cron.schedule('*/30 * * * *', () => {
//       console.log('🧪 Test cron: Checking for expired plans...');
//       runInvoiceCronJob().catch(() => { });
//     });
//     console.log('🧪 Test cron scheduled: Every 30 minutes');
//   }

//   // 🚀 OPTION C: Run immediately on server start (optional, for testing)
//   if (process.env.RUN_CRON_ON_START === 'true') {
//     console.log('🚀 Running cron job immediately on server start...');
//     setTimeout(runInvoiceCronJob, 10000); // Wait 10 seconds for server to fully start
//   }
// }

// // Initialize cron jobs when server starts
// // Wait a few seconds to ensure server is fully ready
// setTimeout(() => {
//   console.log('\n============================================');
//   console.log('🚀 Initializing Cron Jobs...');
//   console.log('============================================');
//   scheduleCronJobs();
//   console.log('✅ Cron jobs initialized successfully');
//   console.log('============================================\n');
// }, 5000); // 5 second delay

// ============================================
// END OF CRON JOB SETUP
// ============================================


////////////////// DATABASE ////////////////////////////////
mongoose.connect(MONGODB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

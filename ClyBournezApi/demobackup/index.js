const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
require('dotenv').config();

const MONGODB = process.env.MONGODB_URI;
const port = process.env.PORT;

// ========== 1. CORS SETUP ==========



// ========== 2. CRITICAL FIX: Simplified Webhook Middleware ==========
// Remove the existing webhookMiddleware and replace with this:

// Apply JSON parser for all routes EXCEPT webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/plan/webhook') {
    console.log('📦 Webhook detected - skipping body parsing');
    next(); // Skip body parsing for webhook
  } else {
    bodyParser.json()(req, res, next);
  }
});

// ========== 3. Other Middleware (AFTER body parsers) ==========
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload()); // ✅ Only once!
app.use('/invoices', express.static(path.join(__dirname, 'public/invoices')));

// ========== 4. Test Endpoints ==========
app.get("/api/test-cors", (req, res) => {
  console.log('✅ Test CORS endpoint hit from:', req.headers.origin);
  res.json({ 
    message: 'CORS test successful',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    server_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
});

// Webhook test endpoint
app.get("/api/webhook-test", (req, res) => {
  console.log('🔍 Webhook test endpoint accessed');
  res.json({
    status: "Webhook endpoint is live",
    url: "https://finval-server.technolite.in/api/plan/webhook",
    method: "POST",
    note: "Stripe sends POST requests with Stripe-Signature header",
    webhook_secret_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
    timestamp: new Date().toISOString()
  });
});

// Simple endpoint to test server
app.get("/api/message", (req, res) => {
  res.json({ 
    message: "Hello from the Backend!",
    server_time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ========== 5. ROUTES ==========
console.log('🔄 Loading routes...');

// Route for getting country information
app.use('/api/country', require('./routes/api/country'));

// Authentication
app.use('/api/auth', require('./routes/api/auth'));

// Queries CRUD
app.use('/api/queries', require('./routes/api/queries'));

// ⚠️ IMPORTANT: Plan routes (includes webhook)
app.use('/api/plan', require('./routes/api/plan'));

// Payment
app.use('/api/payments', require('./routes/api/payment'));

// Front-end
app.use('/api/front', require('./routes/api/front/'));
app.use('/api/stripe', require('./routes/api/front/stripe'));
app.use('/api/order', require('./routes/api/front/order'));

// Admin routes
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

// Test
app.use('/test', require('./Payment/index'));

// ========== 6. ERROR HANDLING ==========
// 404 handler
app.use((req, res, next) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ========== 7. DATABASE & SERVER START ==========
mongoose.connect(MONGODB)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    app.listen(port, () => {
      console.log(`
      🚀 Server is running!
      📍 Port: ${port}
      🌐 URL: http://localhost:${port}
      🔗 Webhook: https://finval-server.technolite.in/api/plan/webhook
      ⏰ Server Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `);
      
      // Log environment info
      console.log(`
      ⚙️ Environment:
      - NODE_ENV: ${process.env.NODE_ENV || 'development'}
      - Stripe Key: ${process.env.STRIPE_KEY ? 'Configured' : 'Missing'}
      - Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'}
      `);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
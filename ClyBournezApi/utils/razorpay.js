const Razorpay = require('razorpay');
require('dotenv').config();

console.log('Razorpay Environment Check:', {
  keyIdExists: !!process.env.RAZORPAY_KEY_ID,
  keyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set',
  keySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
  environment: process.env.NODE_ENV
});

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test the instance
console.log('Razorpay instance created successfully:', !!razorpay);

module.exports = razorpay;
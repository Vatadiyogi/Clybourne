const mongoose = require("mongoose");

const razorpayRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customers',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  selectedPlanType: {
    type: String,
    enum: ['new', 'upgrade', 'renewal'],
    default: 'new'
  },
  planPrice: {
    type: Number,
    required: true
  },
  totalReports: {
    type: Number,
    required: true
  },
  accessDays: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  amountInINR: {
    type: Number,
    required: true
  },
  receipt: {
    type: String,
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("RazorpayRecord", razorpayRecordSchema);
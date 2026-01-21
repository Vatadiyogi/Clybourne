const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomersSchema = new Schema({
    customerId: {
        type: Number,
        unique: true,
        //   required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: { type: String, },
    resetPasswordExpires: { type: Date, },
    company: {
        type: String,
        required: true
    },
    industry: {
        type: String
    },
    jobTitle: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    registerDate: {
        type: Date,
        default: null
    },
    otp: {
        type: Number,
        default: null
    },
    lastOtpDate: {
        type: Date,
        default: null
    },
    lastLoginDate: {
        type: Date,
        default: null
    },
    lastOrderDate: {
        type: Date,
        default: null
    },
    activePlanId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    },
    activePlanSeqId: {
        type: String,
        default: null
    },
    activePlanType: {
        type: String,
        default: null
    },
    activePlanExpiryDate: {
        type: Date,
        default: null
    },
    TotalPlanOrderedCount: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // Default to active
    },
});

const CustomersModel = mongoose.model('Customers', CustomersSchema, 'customers');
module.exports = CustomersModel;

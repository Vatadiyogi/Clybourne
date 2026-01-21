const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlanRecordSchema = mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Customers'
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan'
        },
        planTxnId: {
            type: String
        },
        planSeqId: {
            type: Number,
        },
        orderType: {
            type: String
        },
        planType: {
            type: String
        },
        accessDays: {
            type: Number
        },
        amount: {
            type: Number
        },
        startAt: {
            type: Date,
            required: true
        },
        expiresAt: {
            type: Date
        },
        balanceQuota: {
            type: Number,
            default: 0
        },
        activatedAt: {
            type: Date,
            default: null
        },
        planStatusType: {
            type: String,
            enum: ['active', 'queued', 'inactive', 'completed', 'expired'],
            default: null
        },
        invoiceSent: {
            type: Number,
            default: 0
        },
        upgradedFromPlanId: {
            type: Schema.Types.ObjectId,
            ref: 'PlanRecord'
        },
        queries: [{ type: Schema.Types.ObjectId, ref: 'Query' }],
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
        invoicePath: {
            type: String
        },
        // In models/plan-record.model.js (add this if not exists)
        paymentGateway: {
            type: String,
            enum: ['stripe', 'razorpay', 'paypal', 'other'],
            default: 'stripe'
        }
    },
    { timestamps: true }
)

const PlanRecoredModel = mongoose.model('PlanRecord', PlanRecordSchema);
module.exports = PlanRecoredModel;
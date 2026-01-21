const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'Customers',
            required: true
        },
        country: {
            type: String,
            required: true
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: true
        },
        planSeqId: {
            type: String,
            required: true
        },
        planType: {
            type: String,
            required: true
        },
        orderType: {
            type: String,
            enum: ['New', 'Upgrade'],
            required: true
        },
        reportCount: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        gatewayType: {
            type: String,
            required: true
        },
        txnId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Failed', 'Success'],
            default: 'Pending'
        },
        message: {
            type: String,
            required: true
        },
        response: Schema.Types.Mixed
    },
    { timestamps: true }
);

const TransactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = TransactionModel;

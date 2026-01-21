const mongoose = require('mongoose');
const { Schema } = mongoose;

const StripeRecordSchema = mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Customers',
            require: true
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            require: true
        },
        transactionId: {
            type: Number,
        },
        transactionStatus: {
            type: String,
            default: "pending"
        },
        selectedPlanType: {
            type: String,
            default: null
        },
        planPrice: {
            type: Number,
            default: null
        },
        totalReports: {
            type: Number,
            default: null
        },
        accessDays: {
            type: Number,
            default: null
        },
        sessionId: {
            type: String,
            require: true
        }
    },
    { timestamps: true }
)

const StripeRecoredModel = mongoose.model('StripeRecord', StripeRecordSchema);
module.exports = StripeRecoredModel;
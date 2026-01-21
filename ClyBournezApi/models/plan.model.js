const mongoose = require('mongoose');

const PlanSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,   
        required: true
    },
    userplandescription : {
        type: String,
        required: true 
    },
    planType: {
        type: String,
        enum: ['BO', 'BOA' ,'Advisor'], // You can add other plan types as needed
        required: true
    },
    reports: {
        type: Number,
        required: true
    },
    accessDays: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // Default to active
    },
    isDeleted: {
        type: Number,
        enum: [0, 1],
        default: 0 // Default to not deleted
    },
    displaySequence: {
        type: Number,
        required: true
    },
    sequenceId: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: null
    }
});

const PlanModel = mongoose.model('Plan', PlanSchema);
module.exports = PlanModel;

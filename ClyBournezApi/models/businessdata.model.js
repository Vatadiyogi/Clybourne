const mongoose = require('mongoose');

const BusinessdataSchema = mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    display_value: {
        type: String,
        required: true
    },
    discount_factor: {
        type: Number,
        required: true
    },
    alpha_factor: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // Default to active
    },
    sequenceId: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const BusinessdataModel = mongoose.model('Businessdata', BusinessdataSchema, 'businessdata');
module.exports = BusinessdataModel;

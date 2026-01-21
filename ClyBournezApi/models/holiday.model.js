const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    day: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const HolidayModel = mongoose.model('Holiday', HolidaySchema, 'holidays'); // Ensure collection name 'holidays'
module.exports = HolidayModel;

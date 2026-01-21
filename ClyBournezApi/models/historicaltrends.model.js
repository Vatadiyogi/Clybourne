const mongoose = require('mongoose');

const HistoricalTrendsSchema = mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    display_value: {
        type: String,
        required: true
    },
    discount_factor : {
        type: Number,
        required: false
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

const HistoricalTrendsModel = mongoose.model('Historicaltrends', HistoricalTrendsSchema);
module.exports = HistoricalTrendsModel;

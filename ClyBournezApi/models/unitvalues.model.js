const mongoose = require('mongoose');

const UnitvaluesSchema = mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    display_value: {
        type: String,
        required: true
    },
    factor : {
        type: mongoose.Types.Decimal128,
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

const UnitvaluesModel = mongoose.model('Turnoverfactor', UnitvaluesSchema);
module.exports = UnitvaluesModel;

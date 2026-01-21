const mongoose = require('mongoose');

const TurnoverFactorSchema = mongoose.Schema({
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: false
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

const TurnoverFactorModel = mongoose.model('Turnoverfactor', TurnoverFactorSchema, 'turnoverfactor');
module.exports = TurnoverFactorModel;

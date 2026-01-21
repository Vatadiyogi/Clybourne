const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        default: 1
    }
});

const CurrencyModel = mongoose.model('Currency', CurrencySchema);
module.exports = CurrencyModel;

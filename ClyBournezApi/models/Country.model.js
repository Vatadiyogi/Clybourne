const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
});

const CountryModel = mongoose.model('Country', CountrySchema);
module.exports = CountryModel;

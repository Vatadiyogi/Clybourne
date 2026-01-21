const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // Default to active
    },
},
{ timestamps: true }
);

const IndustryModel = mongoose.model('Industry', IndustrySchema);
module.exports = IndustryModel;

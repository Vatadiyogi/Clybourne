const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubIndustrySchema = new mongoose.Schema({
    industryId: {
        type: Schema.Types.ObjectId,
        ref: 'Industry'
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // Default to active
    },
}, { timestamps: true });

const SubIndustryModel = mongoose.model('SubIndustry', SubIndustrySchema);
module.exports = SubIndustryModel;

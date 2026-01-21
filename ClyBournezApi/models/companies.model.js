const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;

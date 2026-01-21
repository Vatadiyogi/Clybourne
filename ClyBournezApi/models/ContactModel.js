const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },
    company_name: {
        type: String,
        required: [true, 'Company Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    country_of_operation: {
        type: String,
        required: [true, 'Country of Operation is required'],
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        default: 0 // 0 = pending, 1 = responded, 2 = closed
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


const ContactModel = mongoose.model('Contact', contactSchema);
module.exports = ContactModel;
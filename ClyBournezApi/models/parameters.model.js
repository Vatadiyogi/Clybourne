const mongoose = require('mongoose');

const ParameterSchema = new mongoose.Schema({
    // Numbers of hours allowed to modify the report after initial report creation
    hoursAllowed: {
        type: Number,
        required: true
    },
    // Number of working days in which report to be generated
    workingDays: {
        type: Number,
        required: true
    },
    // Default for DCF Weightage (%)
    dcfWeightage: {
        type: Number,
        required: true
    },
    // Time of the creation of the new record
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ParameterModel = mongoose.model('Parameter', ParameterSchema);
module.exports = ParameterModel;

// This is the Parameters schema which is used to store the parameter form inputs in the database.

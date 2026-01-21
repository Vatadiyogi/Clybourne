const mongoose = require('mongoose');
const { Schema } = mongoose;

const StripeResponseSchema = new mongoose.Schema(
    {
        event_response: {
            type: Schema.Types.Mixed,  // This allows storing objects, arrays, or any type of data
            default: null
        }
    },
    { timestamps: true }
);

const StripeResponseModel = mongoose.model('StripeResponse', StripeResponseSchema);
module.exports = StripeResponseModel;
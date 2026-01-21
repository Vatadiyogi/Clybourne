const router = require('express').Router();
const Parameters = require('../../../../models/parameters.model');

// Get the Parameters object
router.get('/parameters', async (req, res) => {
    try {
        const parameter = await Parameters.findOne().sort({ createdAt: -1 }); // Fetch the latest entry
        res.status(200).json(parameter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post the Parameters object
router.post('/parameters', async (req, res) => {
    try {
        const parameter = await Parameters.findOneAndUpdate(
            {}, // Find any existing document
            req.body, // Update with the request body
            {
                new: true, // Return the updated document
                upsert: true, // Create a new document if none exists
                setDefaultsOnInsert: true // Apply default values if creating a new document
            }
        );
        res.status(200).json(parameter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
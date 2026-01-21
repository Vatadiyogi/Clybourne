const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../../../../models/customers.model');

// Get all plans
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific plan
router.get('/:userId', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.userId);
        res.json(customer);
    } catch (err) {
        res.json({ message: err })
    }
})


router.put('/edit/:id', async (req, res) => {
    const { id } = req.params; // Get the plan ID from request parameters

    try {
        // Create an object with the fields to update
        const updatedFields = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            status: req.body.status !== undefined ? req.body.status : 1
        };

        const options = { new: true }; // To return the updated document

        // Find the user by ID and update with new fields
        const updatedUserDoc = await Customer.findByIdAndUpdate(id, updatedFields, options);

        if (!updatedUserDoc) {
            return res.status(202).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/delete/:userId', async (req, res) => {
    try {
        const removedUser = await User.findByIdAndDelete(req.params.userId);
        if (!removedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/profile/:userId', async (req, res) => {
    try {
        const profile = await User.findById(req.params.userId).select('_id name role status email');
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/profile/update/:userId', async (req, res) => {
    const { userId } = req.params; // Corrected from `id` to `userId`
    
    try {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Create an object with the fields to update
        const updatedFields = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        // Check if password is provided and add to updatedFields if present
        if (req.body.password) {
            updatedFields.password = bcrypt.hashSync(req.body.password, 10);
        }

        const options = { new: true }; // To return the updated document

        // Find the user by ID and update with new fields
        const updatedUserDoc = await User.findByIdAndUpdate(userId, updatedFields, options);

        if (!updatedUserDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Admin User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
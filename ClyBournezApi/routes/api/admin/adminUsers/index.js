const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../../../models/user.model');
const EmailTemplate = require('../../../../email/sendMail');

// Get all plans
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isAdmin: true })
                                .select('_id name role status email')
                                .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific plan
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('_id name role status email');
        res.json(user);
    } catch (err) {
        res.json({ message: err })
    }
})

router.post('/store', async (req, res) => {
    try {
        // Do the admin signup
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            adminPassword: bcrypt.hashSync(req.body.password),
            role: req.body.role,
            isAdmin: true
        });
        await user.save();
        // create jwt token
        const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        user.verified = true;
        await user.save();

        // Send an email
        let html = await EmailTemplate.adminUserPassowrd(req.body.name, req.body.email, req.body.password, req.body.role, process.env.ADMINBASEURL);
        let result = await EmailTemplate.sendMail({
          email: user.email,
          subject: await EmailTemplate.fetchSubjectTemplate(14),
          application_name: "FinVal",
          text: "",
          html: html
        });

        const savedAdmin = await user.save();
        res.status(200).json({ message: "Admin added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

        // Check if password is provided and add to updatedFields if present
        if (req.body.password) {
            updatedFields.adminPassword = bcrypt.hashSync(req.body.password);
        }

        const options = { new: true }; // To return the updated document

        // Find the user by ID and update with new fields
        const updatedUserDoc = await User.findByIdAndUpdate(id, updatedFields, options);

        if (!updatedUserDoc) {
            return res.status(202).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Admin User updated successfully' });
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
            updatedFields.adminPassword = bcrypt.hashSync(req.body.password, 10);
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


// Route to generate frontend token for admin login
router.post('/generate-frontend-token', async (req, res) => {
  try {
    const { adminId } = req.body; // Get admin ID from request body
    console.log(adminId); 
    // Find the admin user by their ID
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ status: false, message: 'Admin user not found', data: [] });
    }

    // Generate a token for the admin to use on the frontend
    const token = jwt.sign(
      { adminId: adminUser._id, role: 'admin' }, // Payload: admin ID and role
      process.env.ENCRYPTION_KEY,               // Your secret key for token signing
      { expiresIn: '15m' }                      // Token expiry time (e.g., 15 minutes)
    );

    // Send the token in response
    return res.status(200).json({
      status: true,
      message: 'Frontend token generated successfully',
      token, // The token to be sent to the frontend
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: [] });
  }
});


module.exports = router;
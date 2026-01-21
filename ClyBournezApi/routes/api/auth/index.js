var router = require("express").Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mail = require('../../../MailSettings/MailTransport');
// importing User Schema  
const User = require('../../../models/user.model');
const { verifyAccessToken, verifyRefreshToken } = require("../../../middleware/auth");
const OrderModel = require('../../../models/orders.model');

const sendEmailVerification = (email, emailToken) => {
    return; // TESTING:: Added here for testing purpose only. In Production It should not be present
    const url = process.env.EMAIL_VERIFY_URI + '?token=' + emailToken;
    const emailData = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Verify Email',
        html: `
        <h1>Please click on the link to verify your email</h1>
        <a href=${url}>${url}</a>
        `
    }
    return mail.sendMail(emailData)
}

router.get('/', verifyAccessToken, async (req, res) => {
    const userId = req.body.userId;
    var header = req.headers.authorization || '';       // get the auth header
    const token = header.split(/\s+/).pop() || '';        // and the encoded auth token
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'Invalid token' });
        }
        if (user.accessToken != token) {
            return res.json({ success: false, message: 'Invalid token' });
        }
        return res.json({ success: true, message: "Valid Token", email: user.email, id: user._id, name: user.name, phone: user.phone });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, token: 'Invalid', message: err });
    }
})

//SignUp using email & password and it sends OTP to email
router.post('/signup', async (req, res) => {
    console.log('SIGNUP');
    var header = req.headers.authorization || '';       // get the auth header
    var isAdmin = false;
    var passwordHash = '';
    const { name, email, phone } = req.body;
    if (header != '') {
        // trying to access admin
        var token = header.split(/\s+/).pop() || '';        // and the encoded auth token
        var auth = Buffer.from(token, 'base64').toString(); // convert from base64
        var parts = auth.split(/:/);                        // split on colon
        const adminKey = parts.shift();                       // username is first
        const password = parts.join(':');                     // everything else is the password
        if (!!adminKey) {
            if (adminKey != '') {
                if (adminKey == process.env.ADMIN_KEY) {
                    isAdmin = true;
                    passwordHash = bcrypt.hashSync(password);
                }
                else {
                    return res.json({ success: false, message: 'Admin signup Failed. Wrong information passed' });
                }
            }
            else {
                return res.json({ success: false, message: 'Admin signup Failed. Wrong information passed' });
            }
        }
        else {
            return res.json({ success: false, message: 'Admin signup Failed. Wrong information passed' });
        }
    }
    if (!email) {
        return res.json({ success: false, message: 'Email was not given' });
    }
    else if (!name) {
        return res.json({ success: false, message: 'Name was not provided' });
    }
    else {
        try {
            // Check if email already exist.
            const testUser = await User.findOne({ email });
            console.log(testUser);
            if (!!testUser) {
                return res.json({ success: false, message: 'User with email:' + email + ' already registered' });
            }
            // create new user in databse.
            if (isAdmin) {
                // Do the admin signup
                const user = new User({
                    email: email,
                    name: name,
                    phone: phone,
                    isAdmin: isAdmin,
                    adminPassword: passwordHash
                });
                await user.save();
                // create jwt token
                const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
                const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
                user.refreshToken = refreshToken;
                user.accessToken = accessToken;
                user.verified = true;
                await user.save();
                res.json({
                    success: true,
                    message: 'New user created with email:' + email + ' Use the accessToken and Refresh Token for further communication',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    isAdmin: true
                });
            } else {
                const user = new User({
                    email: email,
                    name: name,
                    phone: phone,
                    isAdmin: isAdmin
                });
                await user.save();
                // create jwt token
                const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
                const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
                user.refreshToken = refreshToken;
                user.accessToken = accessToken;
                await sendEmailVerification(email, refreshToken)
                await user.save();
                res.json({
                    success: true,
                    message: 'New user created with email:' + email + ' and verification email sent',
                    accessToken: accessToken,
                    refreshToken:refreshToken  // TESTING:: Added here for testing purpose only. In Production It should not be present
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.json({ success: false, message: err });
        }
    }
});

router.post('/login', async (req, res) => {
    var header = req.headers.authorization || '';       // get the auth header
    var isAdmin = false;
    var password = '';
    const email = req.body.email;
    if (header != '') {
        // trying to access admin
        var token = header.split(/\s+/).pop() || '';// and the encoded auth token
        var auth = Buffer.from(token, 'base64').toString(); // convert from base64
        var parts = auth.split(/:/);                        // split on colon
        const adminKey = parts.shift();                       // username is first
        password = parts.join(':');                     // everything else is the password
        if (!!adminKey) {
            if (adminKey != '') {
                if (adminKey == process.env.ADMIN_KEY) {
                    isAdmin = true;
                }
                else {
                    return res.json({ success: false, message: 'Admin1 login Failed. Wrong information passed' });
                }
            }
            else {
                return res.json({ success: false, message: 'Admin2 login Failed. Wrong information passed' });
            }
        }
        else {
            return res.json({ success: false, message: 'Admin3 login Failed. Wrong information passed' });
        }
    }
    if (!email) {
        return res.json({ success: false, message: 'Email was not given' });
    }
    else {
        try {
            // Check if email already exist.
            const user = await User.findOne({ email: email })
            // console.log(user);
            if (!user) {
                return res.json({ success: false, message: 'User with email:' + email + ' is not registered' });
            }
            // check if Admin user tries to login
            if (user.isAdmin) {
                if (user.isAdmin) {
                    if (!!user.adminPassword) {
                        if (bcrypt.compareSync(password, user.adminPassword)) {
                            // User found. Now update the tokens.
                            const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
                            const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
                            user.refreshToken = refreshToken;
                            user.accessToken = accessToken;
                            user.verified = true;

                            await user.save();
                            res.json({
                                success: true,
                                message: "Admin user logged in successfully",
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                isAdmin: true,
                                id: user._id, // Adding the MongoDB _id to the response
                                name: user.name,
                                role: user.role
                            });
                        } else {
                            return res.json({ success: false, message: 'Admin3 login Failed. Wrong information passed' });
                        }
                    } else {
                        return res.json({ success: false, message: 'Password error for Email ' + email + ' Contact System Admin' });
                    }
                } else {
                    return res.json({ success: false, message: 'Email ' + email + ' is not registered as Admin' });
                }
            } else {
                // User found. Now update the tokens.
                const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
                const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
                user.refreshToken = refreshToken;
                user.accessToken = accessToken;
                user.verified = false
                await sendEmailVerification(email, refreshToken)
                await user.save();
                res.json({
                    success: true,
                    message: "Verification email sent successfuly",
                    accessToken: accessToken,
                    refreshToken: refreshToken, // TESTING:: Added here for testing purpose only. In Production It should not be present
                    id: user._id // Adding the MongoDB _id to the response
                });
            }
        }
        catch (err) {
            res.json({ success: false, message: err });
        }
    }
});

router.get('/verify', verifyAccessToken, async (req, res) => {
    const token = req.query.token;
    const userId = req.body.userId;
    console.log('VERIFY with token = ' + token);
    try {
        const { email, _id } = jwt.verify(token, process.env.JWT_SECRET)
        console.log({ email, _id })
        if (_id != userId) {
            return res.json({ success: false, message: 'accessToken and refreshToken not belong to same user' });
        }
        const user = await User.findById(_id);
        if (!!user) {
            if (user.email == email) {
                if (user.refreshToken == token) {
                    if (user.verified) {
                        res.json({ success: true, message: "User already verified" });
                    } else {
                        user.verified = true;
                        user.lastSignIn = Date.now()
                        await user.save();
                        res.json({ success: true, message: "Verification done successfuly" });
                    }
                } else {
                    console.log('Token not matched');
                    res.json({ success: false, message: { email: 'Matched', token: 'Invalid token' } });
                }
            } else {
                console.log('Email not matched');
                res.json({ success: false, message: { email: 'Not Matched', token: 'Invalid token' } });
            }
        }
        else {
            console.log('user not found');
            res.json({ success: false, message: 'invalid token' });
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err });
    }
})

router.get('/refresh', verifyRefreshToken, async (req, res) => {
    const userId = req.body.userId;
    var header = req.headers.authorization || '';       // get the auth header
    const token = header.split(/\s+/).pop() || '';        // and the encoded auth token
    console.log('REFRESH Token');
    try {
        const user = await User.findById(userId);
        if (!!user) {
            if (user.refreshToken == token) {
                if (user.verified) {
                    const accessToken = jwt.sign({ email: user.email, _id: user._id, mode: 'ACCESS' }, process.env.JWT_SECRET, { expiresIn: "15m" })
                    const refreshToken = jwt.sign({ email: user.email, _id: user._id, mode: 'REFRESH' }, process.env.JWT_SECRET, { expiresIn: "30m" })
                    user.refreshToken = refreshToken;
                    user.accessToken = accessToken;
                    await user.save();
                    res.json({
                        success: true,
                        message: "User Token Refreshed successfully",
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });
                } else {
                    res.json({ success: false, message: "User not yet verified" });
                }
            } else {
                console.log('Token not matched');
                res.json({ success: false, message: 'Invalid token' });
            }
        }
        else {
            console.log('user not found');
            res.json({ success: false, message: 'invalid token' });
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err });
    }
})

router.get('/logout', verifyRefreshToken, async (req, res) => {
    var header = req.headers.authorization || '';       // get the auth header
    const token = header.split(/\s+/).pop() || '';        // and the encoded auth token
    try {
        if(jwt.destroy(token)){
            res.json({ success: true, message: "Token destroyed" });
        }
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err });
    }
});

// Admin auto-login route
router.post('/admin-login', async (req, res) => {
    try {
      const { token, orderId } = req.body;
  
      // Verify admin token
      const decodedToken = jwt.verify(token, process.env.ENCRYPTION_KEY);
      const adminId = decodedToken.adminId;
  
      // Check if the order is assigned to this admin
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ status: false, message: 'Order not found.' });
      }

      if (order.assigned_to.toString() !== adminId) {
        return res.status(403).json({ status: false, message: 'Order is not assigned to this admin.' });
      }

      const user = await User.findById(adminId);
      
      // Generate a new token for frontend login if order verification is successful
      const newToken = jwt.sign({ userId: adminId }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
      return res.status(200).json({
        status: true,
        message: 'Login successful, order verified!',
        data: { token: newToken, name: user.name ,role: "admin"},
      });
  
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  });  

module.exports = router;
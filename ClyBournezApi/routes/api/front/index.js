const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const EmailTemplate = require("../../../email/sendMail");
const CustomersModel = require("../../../models/customers.model");
const BusinessData = require("../../../models/businessdata.model");
const Country = require("../../../models/Country.model");
const HistoricalTrends = require("../../../models/historicaltrends.model");
const IndustryModel = require("../../../models/Industry.model");
const { validate } = require("./../../../middleware/authorizations.middleware");
const { check, validationResult } = require("express-validator");
const CurrencyModel = require('../../../models/Currency.model');
const SubIndustryModel = require('../../../models/SubIndustry.model');
const PlanModel = require('../../../models/plan.model');
const PlanRecoredModel = require('../../../models/plan-record.model');
const OrderModel = require('../../../models/orders.model');
router.post('/customer/signup', [
    check("first_name", "First Name is required!").exists().not().isEmpty(),
    check("last_name", "Last Name is required!").exists().not().isEmpty(),
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
    check("jobTitle", "Job Title is required!").exists().not().isEmpty(),
    check("country", "Country is required!").exists().not().isEmpty(),
    check("company", "Company is required!").exists().not().isEmpty(),
    check("password", "Password is required!").exists().not().isEmpty().isLength({ min: 6 }).withMessage("Password must be 6 characters long"),
    check("new_password", "Verify Password is required!").exists().not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ status: false, message: errors.array()[0].msg, data: [] });
        }

        const { first_name, last_name, email, jobTitle, country, company, password, new_password } = req.body;

        if (password !== new_password) {
            return res.status(200).json({ status: false, message: "Passwords and Confirm Password do not match", data: [] });
        }

        const existingCustomer = await CustomersModel.findOne({ email });
        if (existingCustomer) {
            return res.status(200).json({ status: false, message: "Email ID already exists.", data: [] });
        }

        const latestCustomer = await CustomersModel.findOne().sort({ customerId: -1 });
        let newCustomerId = latestCustomer?.customerId ? latestCustomer.customerId + 1 : 1;

        const customer = new CustomersModel({
            first_name,
            last_name,
            email,
            jobTitle,
            country,
            company,
            password: bcrypt.hashSync(password, 10),
            status: 0,
            customerId: newCustomerId
        });
        // console.log("Before saving:", customer);
        // const savedCustomer = await customer.save();
        // console.log("Saved successfully:", savedCustomer);

        if (await customer.save()) {
            let token = jwt.sign({ userId: customer._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
            console.log("Topken while singup:", token)
            let verification_link = `${process.env.BASEURL}user-verification/${token}`;
            let html = await EmailTemplate.accountVerificationTemplate(verification_link, first_name, process.env.CONTACTEMAIL);
            let result = await EmailTemplate.sendMail({
                email,
                subject: await EmailTemplate.fetchSubjectTemplate(2),
                application_name: "FinVal",
                text: "",
                html
            });
            // console.log("customer is :", customer);
            if (!result) {
                return res.status(200).json({
                    status: false,
                    message: "Registration Successful. Verification link sending failed, please try again later",
                    data: []
                });
            }

            return res.status(200).json({
                status: true,
                message: "Registration Successful. Verification link sent.",
                data: { customer }
            });
        }

        return res.status(200).json({ status: false, message: "Registration failed, please try again later", data: [] });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
router.get('/customer/verify_account_token/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const secretKey = process.env.ENCRYPTION_KEY_VERIFICATION;

        // Use async/await without callback
        console.log("token from params is:", token)
        const decoded = jwt.verify(token, secretKey);
        console.log("Received token:", req.params.token);
        console.log("Secret key:", process.env.ENCRYPTION_KEY_VERIFICATION);
        // Find the user by decoded userId
        const user = await CustomersModel.findOne({ _id: decoded.userId });
        console.log("useris:", user)
        console.log("userStatusis:", user.status);
        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid User.", data: [] });
        }

        // Check if account is already verified
        if (user.status === 1) {
            return res.status(400).json({ status: false, message: "Account is already verified.", data: [] });
        }

        // Update user status to verified
        user.status = 1;
        await user.save();

        // Generate a new access token for the user after account verification
        const access_token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
        console.log("new access token  is:", access_token)
        const userdata = {
            token: access_token,
            user
        };
        console.log("userDataafterSaving:", userdata)
        // Send success response
        return res.status(200).json({ status: true, message: "Account verification is successful.", data: { userdata } });

    } catch (error) {
        // Handle different types of JWT verification errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: "Verification link is expired", data: [] });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, message: "Invalid token", data: [] });
        }

        // Generic error handling
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
router.get('/customer/verify-token', async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ status: false, message: errors.array()[0].msg, 'data': [] });
        }

        const token = req.headers.authorization;
        const secretKey = process.env.ENCRYPTION_KEY;

        jwt.verify(token, secretKey, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
            } else {
                return res.status(200).json({ 'status': false, 'message': "Valid Token.", 'data': [] });
            }
        });

    } catch (error) {
        // Handle different types of JWT verification errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: "Verification link is expired", data: [] });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, message: "Invalid token", data: [] });
        }

        // Generic error handling
        return res.status(401).json({ status: false, message: error.message, data: [] });
    }
});
router.post('/customer/resend_verification_link', [
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, message: errors.array()[0].msg, data: [] });
        }

        const { email } = req.body;

        // 🔹 Check if the user exists
        const user = await CustomersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid Credentials..!!", data: [] });
        }

        // 🔹 Check if already active
        if (parseInt(user.status) === 1) {
            return res.status(400).json({ status: false, message: "User account is already active..!!", data: [] });
        }

        // 🔹 Generate new verification token
        const token = jwt.sign(
            { userId: user._id },
            process.env.ENCRYPTION_KEY_VERIFICATION,
            { expiresIn: "30m" }
        );

        // 🔹 Create verification link
        const verification_link = `${process.env.BASEURL}verify/${token}`;

        // 🔹 Generate email HTML template
        const html = await EmailTemplate.accountVerificationTemplate(verification_link, user.first_name);

        // 🔹 Send email
        const result = await EmailTemplate.sendMail({
            email: email,
            subject: await EmailTemplate.fetchSubjectTemplate(1),
            application_name: "FinVal",
            text: "",
            html: html
        });

        if (!result) {
            return res.status(500).json({
                status: false,
                message: "Verification link sending failed. Please try again later.",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Account verification link has been sent successfully.",
            data: []
        });

    } catch (error) {
        console.error("Resend Verification Error:", error);
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
router.post("/customer/forgot_password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await CustomersModel.findOne({ email });
        if (!user)
            return res.status(404).json({ status: false, message: "Email not found" });
        // Create token valid for 15 minutes
        const token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, {
            expiresIn: "15m",
        });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();
        // Create verification link (frontend route)
        let reset_link = `${process.env.BASEURL}/auth/resetpassword/${token}`;

        // Create HTML email using your existing template system
        let html = await EmailTemplate.forgotPasswordTemplate(
            reset_link,
            user.first_name || "User",
            process.env.CONTACTEMAIL
        );

        // Send Email
        let result = await EmailTemplate.sendMail({
            email,
            subject: await EmailTemplate.fetchSubjectTemplate(3), // you can create id=3 in DB for “Reset Password”
            application_name: "FinVal",
            text: "",
            html,
        });

        if (!result) {
            return res.status(200).json({
                status: false,
                message: "Reset link sending failed, please try again later.",
                data: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Reset link sent successfully to your registered email!",
            data: [],
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
})
router.get("/customer/verify_resetforgotpass_token/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY);

        const user = await CustomersModel.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ status: false, message: "Invalid or expired token" });

        return res.status(200).json({ status: true, message: "Valid token" });
    } catch (error) {
        res.status(400).json({ status: false, message: "Invalid or expired token" });
    }
})
router.post("/customer/reset_password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.ENCRYPTION_KEY);

        const user = await CustomersModel.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ status: false, message: "Invalid or expired token" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ status: true, message: "Password reset successful!" });
    } catch (error) {
        res.status(400).json({ status: false, message: "Invalidee or expired token" });
    }
})
router.post('/customer/login', [
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
    check("password", "Password is required!").exists().not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, message: errors.array()[0].msg, data: [] });
        }

        const { email, password } = req.body;
        let user = await CustomersModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: false, message: "User doesn't exists.", data: [] });
        }

        if (parseInt(user.status) !== 1) {

            let token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
            let verification_link = `${process.env.BASEURL}user-verification/${token}`;
            let html = await EmailTemplate.accountVerificationTemplate(verification_link, user.first_name, process.env.CONTACTEMAIL);
            let result = await EmailTemplate.sendMail({
                email: user.email,
                subject: await EmailTemplate.fetchSubjectTemplate(2),
                application_name: "FinVal",
                text: "",
                html: html
            });
            console.log(result);
            if (result) {
                return res.status(201).json({ status: 'alert', message: "Your account email has not been verified yet. A verification email will be sent again on your email ID. Please click on the verification link in the email to verify your email.", data: [] });
            } else {
                return res.status(201).json({ status: 'alert', message: "Your account email has not been verified yet. Something went wrong while sending verification link. Please try again", data: [] });
            }
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid Credentials..!!", data: [] });
        }

        // Save last login date
        user.lastLoginDate = moment().format();
        await user.save();

        //Check for the page which user needs to navigate to
        //if user have no records of plan then go to pricing
        let navigate = "/pricing"
        const userPlanRecord = await PlanRecoredModel.find({ userId: user.id });
        if (userPlanRecord && userPlanRecord.length === 0) {
            navigate = "/pricing";
        } else {
            const userOrders = await OrderModel.find({ 'matadata.customerId': user.id });
            if (userOrders && userOrders.length > 0) {
                navigate = '/orders';
            } else {
                const activePlan = await PlanRecoredModel.find({ userId: user.id, planStatusType: 'active' });
                if (activePlan && activePlan.length > 0) {
                    navigate = '/valuation-form';
                }
            }
        }
        // if user has created record then navigate to my orders
        // if user has no record but active plan then navigate to new order


        // Sign JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
        const userdata = { token, user, navigate };

        return res.status(200).json({ status: true, message: "Login Successful..!!", data: userdata });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
router.post('/customer/login_with_otp', [
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
    check("otp", "OTP is required!").exists().not().isEmpty().isNumeric().withMessage("OTP must contains numeric values"),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
        }

        const { email, otp } = req.body;
        let user = await CustomersModel.findOne({ email });
        if (!user) {
            return res.status(500).json({ 'status': false, 'message': "Invalid Credentials..!!", 'data': [] });
        }

        if (user && parseInt(user.status) != 1) {
            return res.status(500).json({ 'status': false, 'message': "User account is inactive..!!", 'data': [] });
        }

        if (parseInt(otp) == parseInt(user.otp)) {
            // Save last login date 
            user.lastLoginDate = moment().format();
            await user.save();

            //Check for the page which user needs to navigate to
            //if user have no records of plan then go to pricing
            let navigate = "/pricing"
            const userPlanRecord = await PlanRecoredModel.find({ userId: user.id });
            if (userPlanRecord && userPlanRecord.length === 0) {
                navigate = "/pricing";
            } else {
                const userOrders = await OrderModel.find({ 'matadata.customerId': user.id });
                if (userOrders && userOrders.length > 0) {
                    navigate = '/orders';
                } else {
                    const activePlan = await PlanRecoredModel.find({ userId: user.id, planStatusType: 'active' });
                    if (activePlan && activePlan.length > 0) {
                        navigate = '/valuation-form';
                    }
                }
            }
            // if user has created record then navigate to my orders
            // if user has no record but active plan then navigate to new order

            // Sign JWT Token
            var token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
            const userdata = {};
            userdata.token = token;
            userdata.user = user;
            userdata.navigate = navigate;
            return res.status(200).json({ 'status': true, 'message': "Login Successfull..!!", 'data': { userdata } });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Credentials..!!", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.post('/customer/logout', async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            if (jwt.destroy(token)) {
                return res.status(200).json({ 'status': true, 'message': "Token Destroyed.", 'data': [] });
            } else {
                return res.status(500).json({ 'status': false, 'message': "Something went wrong, please try again later.", 'data': [] });
            }
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.post('/customer/send_otp', [
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
        }

        const { email } = req.body;
        let user = await CustomersModel.findOne({ email });
        if (!user) {
            return res.status(500).json({ 'status': false, 'message': "User doesn't exists.", 'data': [] });
        }

        if (parseInt(user.status) !== 1) {
            let token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
            let verification_link = `${process.env.BASEURL}user-verification/${token}`;
            let html = await EmailTemplate.accountVerificationTemplate(verification_link, user.first_name, process.env.CONTACTEMAIL);
            let result = await EmailTemplate.sendMail({
                email: user.email,
                subject: await EmailTemplate.fetchSubjectTemplate(2),
                application_name: "FinVal",
                text: "",
                html: html
            });

            if (result) {
                return res.status(200).json({ status: "alert", message: "Your account email has not been verified yet. A verification email will be sent again on your email ID. Please click on the verification link in the email to verify your email.", data: [] });
            } else {
                return res.status(201).json({ status: "alert", message: "Your account email has not been verified yet. Something went wrong while sending verification link. Please try again", data: [] });
            }
        }

        let otp = generateOTP(4);
        let html = await EmailTemplate.otpTemplate(otp, user.first_name, process.env.BASEURL);
        let result = await EmailTemplate.sendMail({
            email: user.email,
            subject: await EmailTemplate.fetchSubjectTemplate(1),
            application_name: "FinVal",
            text: "",
            html: html
        });

        if (result) {
            user.otp = otp;
            user.lastOtpDate = moment().format();
            await user.save();
            return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
        } else {
            return res.status(500).json({ 'status': false, 'message': "OTP sending failed, please try again later", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.post('/customer/change_password_otp', async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const secretKey = process.env.ENCRYPTION_KEY;
            const payload = jwt.verify(token, secretKey, async (error, decoded) => {
                if (error) {
                    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
                }

                let user = await CustomersModel.findOne({ _id: decoded.userId });
                if (!user) {
                    return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
                }

                let otp = generateOTP(4);
                let html = await EmailTemplate.otpChangeTemplate(otp, user.first_name, process.env.BASEURL);
                let result = await EmailTemplate.sendMail({
                    email: user.email,
                    subject: await EmailTemplate.fetchSubjectTemplate(8),
                    application_name: "FinVal",
                    text: "",
                    html: html
                });

                if (result) {
                    user.otp = otp;
                    user.lastOtpDate = moment().format();
                    await user.save();

                    return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
                } else {
                    return res.status(500).json({ 'status': false, 'message': "OTP sending failed, please try again later", 'data': [] });
                }
            });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
// reset password for forgetpassword
// router.post('/customer/reset_password', [
//     check("otp", "OTP is required!").exists().not().isEmpty().isNumeric().withMessage("OTP must contains numeric values"),
//     check("newPassword", "Password is required!").exists().not().isEmpty(),
//     check("confirmPassword", "Password is required!").exists().not().isEmpty(),
// ], async (req, res) => {
//  console.log("header",req.headers);
//     try {
//            console.log("header",req.headers);
//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (error, decoded) => {
//                 if (error) {
//                     return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//                 }

//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
//                 }

//                 const { newPassword, confirmPassword } = req.body;

//                 if (newPassword === confirmPassword) {

//                     user.password = bcrypt.hashSync(newPassword, 10);
//                     await user.save();

//                     return res.status(200).json({ 'status': true, 'message': "Password updated successfully.", 'data': [] });

//                 } else {
//                     return res.status(500).json({ 'status': false, 'message': "Password doesn't match.", 'data': [] });
//                 }

//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });
// changepassword after login change password
// ✅ FIXED PASSWORD CHANGE ROUTE
router.put('/customer/change_password', [
    check("newPassword", "New Password is required!").exists().not().isEmpty(),
], validate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, message: errors.array()[0].msg, data: [] });
        }

        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: false, message: "Invalid Token.", data: [] });
        }

        const secretKey = process.env.ENCRYPTION_KEY;
        const payload = jwt.verify(token, secretKey);
        const { otp, oldPassword, newPassword } = req.body;

        const user = await CustomersModel.findById(payload.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found.", data: [] });
        }

        let verified = false;

        // ✅ CASE 1: Verify OTP
        if (otp) {
            if (Number(otp) === Number(user.otp)) {
                const otpExpiryTime = new Date(user.lastOtpDate).getTime() + 5 * 60 * 1000;
                if (Date.now() > otpExpiryTime) {
                    return res.status(400).json({ status: false, message: "OTP expired. Please request a new one.", data: [] });
                }
                verified = true;
                user.otp = null;
                user.lastOtpDate = null;
            } else {
                return res.status(400).json({ status: false, message: "Invalid OTP.", data: [] });
            }
        }

        // ✅ CASE 2: Verify old password
        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ status: false, message: "Old password is incorrect.", data: [] });
            }
            verified = true;
        }

        // ❌ If neither OTP nor old password matched
        if (!verified) {
            return res.status(400).json({ status: false, message: "Provide valid OTP or old password.", data: [] });
        }

        // ✅ Prevent same password reuse
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({ status: false, message: "New password cannot be same as old password.", data: [] });
        }

        // ✅ Save new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            status: true,
            message: "Password updated successfully!",
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
});
// router.put('/customer/change_password', [
//     check("password", "Old Password is required!").exists().not().isEmpty(),
//     check("new_password", "New Password is required!").exists().not().isEmpty(),
// ], validate, async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (error, decoded) => {
//                 if (error) {
//                     return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//                 }

//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
//                 }

//                 const { password, new_password } = req.body;
//                 if (!bcrypt.compareSync(password, req.user.password)) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid Old Password.", 'data': [] });
//                 }

//                 if (bcrypt.compareSync(new_password, req.user.password)) {
//                     return res.status(500).json({ 'status': false, 'message': "Password can not be same as old password.", 'data': [] });
//                 }

//                 user.password = bcrypt.hashSync(password, 10);
//                 await user.save();

//                 return res.status(200).json({ 'status': true, 'message': "Password updated successfully.", 'data': [] });
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });
router.put('/customer/update_profile', [
    check("first_name", "First Name is required!").exists().not().isEmpty(),
    check("last_name", "Last Name is required!").exists().not().isEmpty(),
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
    check("jobTitle", "Job Title is required!").exists().not().isEmpty(),
    check("country", "Country is required!").exists().not().isEmpty(),
    check("company", "Company is required!").exists().not().isEmpty(),
], validate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
        }

        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const secretKey = process.env.ENCRYPTION_KEY;
            const payload = jwt.verify(token, secretKey, async (err, decoded) => {
                const { first_name, last_name, email, industry, jobTitle, country, phone, company } = req.body;
                let user = await CustomersModel.findOne({ _id: decoded.userId });
                if (!user) {
                    return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
                }

                const existingCustomer = await CustomersModel.findOne({ email });
                if (existingCustomer && existingCustomer._id.toString() !== decoded.userId) {
                    return res.status(500).json({ 'status': false, 'message': "Email ID already exists.", 'data': [] });
                }

                const updatedFields = { first_name, last_name, email, jobTitle, country, phone, company };
                if (req.body.password) {
                    updatedFields.password = bcrypt.hashSync(req.body.password, 10);
                }

                const options = { new: true };
                const updatedCustomer = await CustomersModel.findByIdAndUpdate(decoded.userId, updatedFields, options);
                if (!updatedCustomer) {
                    return res.status(500).json({ 'status': false, 'message': 'User not found', 'data': [] });
                }

                return res.status(200).json({ 'status': true, 'message': "Profile data updated successfully.", 'data': { updatedCustomer } });
            });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
// no image on hold
router.put('/customer/update_profile_image', validate, async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const secretKey = process.env.ENCRYPTION_KEY;
            const payload = jwt.verify(token, secretKey, async (err, decoded) => {
                let user = await CustomersModel.findOne({ _id: decoded.userId });
                if (!user) {
                    return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
                }

                if (req.files && Object.keys(req.files).length !== 0) {
                    const updateBody = {};
                    updateBody.profilePhoto = await uploadImage(req, res);

                    const options = { new: true };
                    const updatedCustomer = await CustomersModel.findByIdAndUpdate(decoded.userId, updateBody, options);
                    if (!updatedCustomer) {
                        return res.status(500).json({ 'status': false, 'message': 'User not found', 'data': [] });
                    }

                    return res.status(200).json({ 'status': true, 'message': "Profile data updated successfully.", 'data': [] });
                } else {
                    return res.status(500).json({ 'status': false, 'message': "Invalid Image File.", 'data': [] });
                }
            });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.get('/customer/profile', validate, async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const secretKey = process.env.ENCRYPTION_KEY;
            const payload = jwt.verify(token, secretKey, async (err, decoded) => {
                let user = await CustomersModel.findOne({ _id: decoded.userId });
                let countries = await Country.find().sort({ name: 1 });
                if (!user) {
                    return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
                }

                return res.status(200).json({ 'status': true, 'message': "Profile data fetched successfully.", 'data': { user, countries } });
            });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
// no delete option on hold
router.delete('/customer/delete/:userId', validate, async (req, res) => {
    try {
        const removedUser = await User.findByIdAndDelete(req.params.userId);
        if (!removedUser) {
            return res.status(404).json({ message: 'Invalid User' });
        }

        return res.status(200).json({ 'status': true, 'message': "User account is deleted", 'data': [] });
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.post('/customer/verify_token', async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const secretKey = process.env.ENCRYPTION_KEY;
            const payload = jwt.verify(token, secretKey, async (err, decoded) => {
                let user = await CustomersModel.findOne({ _id: decoded.userId });
                if (!user) {
                    return res.status(500).json({ 'status': false, 'message': "Invalid Token or Expired.", 'data': [] });
                }

                token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "30m" });

                const userdata = {};
                userdata.token = token;
                userdata.user = user;
                return res.status(200).json({ 'status': true, 'message': "Token Verified and Refreshed.!!", 'data': { userdata } });
            });
        } else {
            return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
    
// Common APIs
router.get('/business-years', async (req, res) => {
    try {
        let businessdata = await BusinessData.find({ status: 1 });
        if (!businessdata) {
            return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
        }

        return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { businessdata } });
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.get('/historical-trends', async (req, res) => {
    try {
        let historicaltrends = await HistoricalTrends.find({ status: 1 });
        if (!historicaltrends) {
            return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
        }

        return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { historicaltrends } });
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
router.get('/countries', async (req, res) => {
    try {
        let countries = await Country.find().sort({ name: 1 });
        if (!countries) {
            return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
        }

        return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { countries } });
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
// router.get('/formdata', async (req, res) => {
//     try {
//         const token = req.headers.authorization;
//         const secretKey = process.env.ENCRYPTION_KEY;
//         const payload = jwt.verify(token, secretKey, async function (error, decoded) {
//             if (error) {
//                 return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//             }

//             let ActiveplanAvailable = false;
//             let noPlan = false;

//             // Fetch Record of User 
//             const ActiveplanRecord = await PlanRecoredModel.findOne({ 'userId': decoded.userId, planStatusType: 'active' });
//             if (ActiveplanRecord) {
//                 const planCount = ActiveplanRecord.balanceQuota - ActiveplanRecord.orders.length;
//                 if (planCount > 0) {
//                     ActiveplanAvailable = true;
//                 }
//             }

//             const AllRecords = await PlanRecoredModel.findOne({ 'userId': decoded.userId });
//             if (AllRecords && AllRecords.length > 0) {
//                 noPlan = true;
//             }

//             const PlanData = { 'ActiveplanAvailable': ActiveplanAvailable, 'noPlan': noPlan };

//             // Fetching the required data from the database
//             let countries = await Country.find().sort({ name: 1 });
//             let historicaltrends = await HistoricalTrends.find({ status: 1 });
//             let businessdata = await BusinessData.find({ status: 1 });
//             let industries = await IndustryModel.find({ status: 1 });
//             let subindustries = await SubIndustryModel.find({ status: 1 });
//             let currency = await CurrencyModel.find({ status: 1 }).sort({ code: 1 });

//             // Create a map to hold the sub-industry data grouped by industry names
//             const subIndustryMap = {};

//             // Loop through each sub-industry
//             subindustries.forEach(subIndustry => {
//                 // Find the industry associated with this sub-industry
//                 const industry = industries.find(ind => ind._id.equals(subIndustry.industryId));
//                 if (industry) {
//                     const industryName = industry.name;

//                     // Initialize the array if it doesn't exist for this industry name
//                     if (!subIndustryMap[industryName]) {
//                         subIndustryMap[industryName] = [];
//                     }

//                     // Add the sub-industry to the corresponding industry name array
//                     subIndustryMap[industryName].push(subIndustry);
//                 }
//             });

//             // Prepare the response object
//             const responseData = {
//                 countries,
//                 historicaltrends,
//                 businessdata,
//                 industries,
//                 subIndustries: subIndustryMap,
//                 currency,
//                 planData: PlanData
//             };

//             // Send the response
//             return res.status(200).json({
//                 status: true,
//                 message: "Success.",
//                 data: responseData
//             });
//         });
//     } catch (error) {
//         // Handle errors and send a failure response
//         return res.status(500).json({
//             status: false,
//             message: error.message,
//             data: []
//         });
//     }
// });
router.get('/formdata', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const secretKey = process.env.ENCRYPTION_KEY;

        const decoded = jwt.verify(token, secretKey);

        const [activePlan, allRecords, countries, historicaltrends, businessdata, industries, subindustries, currency] = await Promise.all([
            PlanRecoredModel.findOne({ userId: decoded.userId, planStatusType: 'active' }).lean(),
            PlanRecoredModel.find({ userId: decoded.userId }).lean(),
            Country.find().sort({ name: 1 }).lean(),
            HistoricalTrends.find({ status: 1 }).lean(),
            BusinessData.find({ status: 1 }).lean(),
            IndustryModel.find({ status: 1 }).lean(),
            SubIndustryModel.find({ status: 1 }).lean(),
            CurrencyModel.find({ status: 1 }).sort({ code: 1 }).lean(),
        ]);

        const ActiveplanAvailable = activePlan && activePlan.balanceQuota - activePlan.orders.length > 0 ? true : false;
        const noPlan = allRecords && allRecords.length > 0 ? true : false;

        // Map sub-industries to industries
        const industryMap = industries.reduce((map, industry) => {
            map[industry._id.toString()] = industry.name;
            return map;
        }, {});

        const subIndustryMap = subindustries.reduce((map, subIndustry) => {
            const industryName = industryMap[subIndustry.industryId.toString()];
            if (industryName) {
                if (!map[industryName]) {
                    map[industryName] = [];
                }
                map[industryName].push(subIndustry);
            }
            return map;
        }, {});

        const responseData = {
            countries,
            historicaltrends,
            businessdata,
            industries,
            subIndustries: subIndustryMap,
            currency,
            planData: { ActiveplanAvailable, noPlan },
        };

        return res.status(200).json({ status: true, message: "Success.", data: responseData });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
function generateOTP(limit = 4) {
    let digits = "0123456789";
    let code = "";
    for (let i = 0; i <= limit; i++) {
        code += digits[Math.floor(Math.random() * 10)];
    }

    return code;
}
function uploadImage(req, res) {
    return new Promise((resolve, reject) => {
        let profilePhoto = req.files.profilePhoto;
        const fileName = req.files.profilePhoto.name;
        profilePhoto.mv("../../../uploads/customer/" + fileName,
            function (error) {
                if (error) {
                    return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
                }

                resolve(fileName);
            }
        );
    });
}
router.get('/customer/plan', validate, async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ status: false, message: "Invalid Token.", data: [] });
        }

        const secretKey = process.env.ENCRYPTION_KEY;
        const decoded = jwt.verify(token, secretKey);

        const user = await CustomersModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "Invalid User.", data: [] });
        }

        const [bopPlan, boPlan] = await Promise.all([
            PlanModel.findOne({ planType: 'BOP', status: 1 }),
            PlanModel.findOne({ planType: 'BO', status: 1 })
        ]);

        const bopPrice = bopPlan ? bopPlan.price : 0;
        const boPrice = boPlan ? boPlan.price : 0;
        const upgradePrice = bopPrice - boPrice;
        const isUpgradeAvailable = user.activePlanType === 'BO';

        const responseData = {
            upgrade: isUpgradeAvailable,
            price: isUpgradeAvailable ? upgradePrice : 0,
            currentPlan: user.activePlanType
        };

        return res.status(200).json({ status: true, message: "Plan Data Fetched Successfully.", data: responseData });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message, data: [] });
    }
});
router.post('/customer/send_testmail', [
    check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
        }

        const { email } = req.body;
        let otp = generateOTP(4);
        let html = await EmailTemplate.otpTemplate(otp, "Developer");
        let result = await EmailTemplate.sendMail({
            email: email,
            subject: await EmailTemplate.fetchSubjectTemplate(1),
            application_name: "FinVal",
            text: "",
            html: html
        });

        if (result) {
            return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
        } else {
            return res.status(200).json({ 'status': false, 'message': "Something went wrong, please try again later", 'data': [] });
        }
    } catch (error) {
        return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
    }
});
module.exports = router;


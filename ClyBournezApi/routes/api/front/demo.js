// const router = require('express').Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const moment = require("moment");
// const EmailTemplate = require("../../../email/sendMail");
// const CustomersModel = require("../../../models/customers.model");
// const BusinessData = require("../../../models/businessdata.model");
// const Country = require("../../../models/Country.model");
// const HistoricalTrends = require("../../../models/historicaltrends.model");
// const IndustryModel = require("../../../models/Industry.model");
// const { validate } = require("./../../../middleware/authorizations.middleware");
// const { check, validationResult } = require("express-validator");
// const CurrencyModel = require('../../../models/Currency.model');
// const SubIndustryModel = require('../../../models/SubIndustry.model');
// const PlanModel = require('../../../models/plan.model');
// const PlanRecoredModel = require('../../../models/plan-record.model');
// const OrderModel = require('../../../models/orders.model');

// router.post('/customer/signup', [
//     check("first_name", "First Name is required!").exists().not().isEmpty(),
//     check("last_name", "Last Name is required!").exists().not().isEmpty(),
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
//     check("jobTitle", "Job Title is required!").exists().not().isEmpty(),
//     check("country", "Country is required!").exists().not().isEmpty(),
//     check("company", "Company is required!").exists().not().isEmpty(),
//     check("password", "Password is required!").exists().not().isEmpty().isLength({ min: 6 }).withMessage("Password must be 6 characters long"),
//     check("new_password", "Verify Password is required!").exists().not().isEmpty(),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const { first_name, last_name, email, jobTitle, country, company, password, new_password, status } = req.body;

//         // Compare the passwords
//         if (password !== new_password) {
//             return res.status(500).json({ status: false, message: "Passwords do not match", 'data': [] });
//         }

//         // Check if the email already exists
//         const existingCustomer = await CustomersModel.findOne({ email });
//         if (existingCustomer) {
//             return res.status(500).json({ 'status': false, 'message': "Email ID already exists.", 'data': [] });
//         }

//         // Fetch the latest customerId and increment
//         const latestCustomer = await CustomersModel.findOne().sort({ customerId: -1 });  // Sorting in descending order to get the latest customerId
//         let newCustomerId = 1; // Default to 1 if no customer exists

//         if (latestCustomer && latestCustomer.customerId) {
//             newCustomerId = latestCustomer.customerId + 1;  // Increment customerId
//         }

//         // Create the customer
//         const customer = new CustomersModel({
//             first_name: first_name,
//             last_name: last_name,
//             email: email,
//             jobTitle: jobTitle,
//             country: country,
//             company: company,
//             password: bcrypt.hashSync(password, 10),
//             status: 0,
//             customerId: newCustomerId  // Assign the new customerId
//         });

//         // Save the customer
//         if (await customer.save()) {
//             // Send account verification email
//             let token = jwt.sign({ userId: customer._id },process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
//              const verification_link= `${process.env.BASEURL}/user-verification/${token}`;
// console.log("verification_link is:",verification_link);
//             let html = await EmailTemplate.accountVerificationTemplate(verification_link, first_name, process.env.CONTACTEMAIL);
//             let result = await EmailTemplate.sendMail({
//                 email: email,
//                 subject: await EmailTemplate.fetchSubjectTemplate(2),
//                 application_name: "FinVal",
//                 text: "",
//                 html: html
//             });

//             if (!result) {
//                 return res.status(500).json({ 'status': false, 'message': "Registration Successful. Verification link sending failed, please try again later", 'data': [] });
//             }

//             // Return success response
//             return res.status(200).json({ 'status': true, 'message': "Registration Successful. Verification link sent.", 'data': { customer } });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Registration failed, please try again later", 'data': [] });
//         }

//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.get('/customer/verify_account_token/:token', async (req, res) => {
//     try {
//         const token = req.params.token;
//         const secretKey = process.env.ENCRYPTION_KEY_VERIFICATION;

//         // Use async/await without callback
//         const decoded = jwt.verify(token, secretKey);

//         // Find the user by decoded userId
//         const user = await CustomersModel.findOne({ _id: decoded.userId });
//         if (!user) {
//             return res.status(400).json({ status: false, message: "Invalid User.", data: [] });
//         }

//         // Check if account is already verified
//         if (user.status === 1) {
//             return res.status(400).json({ status: false, message: "Account is already verified.", data: [] });
//         }

//         // Update user status to verified
//         user.status = 1;
//         await user.save();

//         // Generate a new access token for the user after account verification
//         const access_token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });

//         const userdata = {
//             token: access_token,
//             user
//         };

//         // Send success response
//         return res.status(200).json({ status: true, message: "Account verification is successful.", data: { userdata } });

//     } catch (error) {
//         // Handle different types of JWT verification errors
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ status: false, message: "Verification link is expired", data: [] });
//         } else if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ status: false, message: "Invalid token", data: [] });
//         }

//         // Generic error handling
//         return res.status(500).json({ status: false, message: error.message, data: [] });
//     }
// });

// router.get('/customer/verify-token', async (req, res) => {
//     try {
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(401).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const token = req.headers.authorization;
//         const secretKey = process.env.ENCRYPTION_KEY;

//         jwt.verify(token, secretKey, async (error, decoded) => {
//         if (error) {
//             return res.status(401).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//         }else{
//             return res.status(200).json({ 'status': false, 'message': "Valid Token.", 'data': [] });
//         }
//     });   

//     } catch (error) {
//         // Handle different types of JWT verification errors
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ status: false, message: "Verification link is expired", data: [] });
//         } else if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ status: false, message: "Invalid token", data: [] });
//         }

//         // Generic error handling
//         return res.status(401).json({ status: false, message: error.message, data: [] });
//     }
// });

// router.post('/customer/resend_verification_link', [
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const { email } = req.body;
//         let user = await CustomersModel.findOne({ email });
//         if (!user) {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Credentials..!!", 'data': [] });
//         }

//         if (user && parseInt(user.status) === 1) {
//             return res.status(500).json({ 'status': false, 'message': "User account is already active..!!", 'data': [] });
//         }

//         let token = jwt.sign({ userId: customer._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
//         let verification_link = `${process.env.BASEURL}verify/${token}`;
//         let html = await EmailTemplate.accountVerificationTemplate(verification_link);
//         let result = await EmailTemplate.sendMail({
//             email: email,
//             subject: await EmailTemplate.fetchSubjectTemplate(1),
//             application_name: "FinVal",
//             text: "",
//             html: html
//         });

//         if (!result) {
//             return res.status(500).json({ 'status': false, 'message': "Registration Successfull. Verification link sending failed, please try again later", 'data': [] });
//         }

//         return res.status(200).json({ 'status': true, 'message': "Account verification link has been sent.", 'data': [] });
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/login', [
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
//     check("password", "Password is required!").exists().not().isEmpty(),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ status: false, message: errors.array()[0].msg, data: [] });
//         }

//         const { email, password } = req.body;
//         let user = await CustomersModel.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ status: false, message: "User doesn't exists.", data: [] });
//         }

//         if (parseInt(user.status) !== 1) {

//             let token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
//             let verification_link = `${process.env.BASEURL}user-verification/${token}`;
//             let html = await EmailTemplate.accountVerificationTemplate(verification_link, user.first_name, process.env.CONTACTEMAIL);
//             let result = await EmailTemplate.sendMail({
//                 email: user.email,
//                 subject: await EmailTemplate.fetchSubjectTemplate(2),
//                 application_name: "FinVal",
//                 text: "",
//                 html: html
//             });
//             console.log(result);
//             if (result) {
//                 return res.status(201).json({ status: 'alert', message: "Your account email has not been verified yet. A verification email will be sent again on your email ID. Please click on the verification link in the email to verify your email.", data: [] });
//             } else {
//                 return res.status(201).json({ status: 'alert', message: "Your account email has not been verified yet. Something went wrong while sending verification link. Please try again", data: [] });
//             }
//         }

//         const isMatch = bcrypt.compareSync(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ status: false, message: "Invalid Credentials..!!", data: [] });
//         }

//         // Save last login date
//         user.lastLoginDate = moment().format();
//         await user.save();

//         //Check for the page which user needs to navigate to
//         //if user have no records of plan then go to pricing
//         let navigate = "/pricing"
//         const userPlanRecord = await PlanRecoredModel.find({userId: user.id});
//         if(userPlanRecord && userPlanRecord.length === 0){
//             navigate = "/pricing";
//         }else{
//             const userOrders = await OrderModel.find({'matadata.customerId' : user.id});
//             if(userOrders && userOrders.length > 0) {
//                 navigate = '/orders';
//             }else{
//                 const activePlan = await PlanRecoredModel.find({userId: user.id, planStatusType : 'active'});
//                 if(activePlan && activePlan.length > 0){
//                     navigate = '/valuation-form';
//                 }
//             }
//         }
//         // if user has created record then navigate to my orders
//         // if user has no record but active plan then navigate to new order


//         // Sign JWT Token
//         const token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
//         const userdata = { token, user , navigate };

//         return res.status(200).json({ status: true, message: "Login Successful..!!", data: userdata });

//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message, data: [] });
//     }
// });

// router.post('/customer/login_with_otp', [
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
//     check("otp", "OTP is required!").exists().not().isEmpty().isNumeric().withMessage("OTP must contains numeric values"),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const { email, otp } = req.body;
//         let user = await CustomersModel.findOne({ email });
//         if (!user) {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Credentials..!!", 'data': [] });
//         }

//         if (user && parseInt(user.status) != 1) {
//             return res.status(500).json({ 'status': false, 'message': "User account is inactive..!!", 'data': [] });
//         }

//         if (parseInt(otp) == parseInt(user.otp)) {
//             // Save last login date 
//             user.lastLoginDate = moment().format();
//             await user.save();

//             //Check for the page which user needs to navigate to
//             //if user have no records of plan then go to pricing
//             let navigate = "/pricing"
//             const userPlanRecord = await PlanRecoredModel.find({userId: user.id});
//             if(userPlanRecord && userPlanRecord.length === 0){
//                 navigate = "/pricing";
//             }else{
//                 const userOrders = await OrderModel.find({'matadata.customerId' : user.id});
//                 if(userOrders && userOrders.length > 0) {
//                     navigate = '/orders';
//                 }else{
//                     const activePlan = await PlanRecoredModel.find({userId: user.id, planStatusType : 'active'});
//                     if(activePlan && activePlan.length > 0){
//                         navigate = '/valuation-form';
//                     }
//                 }
//             }
//             // if user has created record then navigate to my orders
//             // if user has no record but active plan then navigate to new order

//             // Sign JWT Token
//             var token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "1d" });
//             const userdata = {};
//             userdata.token = token;
//             userdata.user = user;
//             userdata.navigate = navigate;
//             return res.status(200).json({ 'status': true, 'message': "Login Successfull..!!", 'data': { userdata } });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Credentials..!!", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/logout', async (req, res) => {
//     try {
//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             if (jwt.destroy(token)) {
//                 return res.status(200).json({ 'status': true, 'message': "Token Destroyed.", 'data': [] });
//             } else {
//                 return res.status(500).json({ 'status': false, 'message': "Something went wrong, please try again later.", 'data': [] });
//             }
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/send_otp', [
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const { email } = req.body;
//         let user = await CustomersModel.findOne({ email });
//         if (!user) {
//             return res.status(500).json({ 'status': false, 'message': "User doesn't exists.", 'data': [] });
//         }

//         if (parseInt(user.status) !== 1) {
//             let token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY_VERIFICATION, { expiresIn: "30m" });
//             let verification_link = `${process.env.BASEURL}user-verification/${token}`;
//             let html = await EmailTemplate.accountVerificationTemplate(verification_link, user.first_name,process.env.CONTACTEMAIL);
//             let result = await EmailTemplate.sendMail({
//                 email: user.email,
//                 subject: await EmailTemplate.fetchSubjectTemplate(2),
//                 application_name: "FinVal",
//                 text: "",
//                 html: html
//             });

//             if (result) {
//                 return res.status(200).json({ status: "alert", message: "Your account email has not been verified yet. A verification email will be sent again on your email ID. Please click on the verification link in the email to verify your email.", data: [] });
//             } else {
//                 return res.status(201).json({ status: "alert", message: "Your account email has not been verified yet. Something went wrong while sending verification link. Please try again", data: [] });
//             }
//         }

//         let otp = generateOTP(4);
//         let html = await EmailTemplate.otpTemplate(otp, user.first_name, process.env.BASEURL);
//         let result = await EmailTemplate.sendMail({
//             email: user.email,
//             subject: await EmailTemplate.fetchSubjectTemplate(1),
//             application_name: "FinVal",
//             text: "",
//             html: html
//         });

//         if (result) {
//             user.otp = otp;
//             user.lastOtpDate = moment().format();
//             await user.save();
//             return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "OTP sending failed, please try again later", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/change_password_otp', async (req, res) => {
//     try {
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

//                 let otp = generateOTP(4);
//                 let html = await EmailTemplate.otpChangeTemplate(otp, user.first_name, process.env.BASEURL);
//                 let result = await EmailTemplate.sendMail({
//                     email: user.email,
//                     subject: await EmailTemplate.fetchSubjectTemplate(8),
//                     application_name: "FinVal",
//                     text: "",
//                     html: html
//                 });
        
//                 if (result) {
//                     user.otp = otp;
//                     user.lastOtpDate = moment().format();
//                     await user.save();

//                     return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
//                 } else {
//                     return res.status(500).json({ 'status': false, 'message': "OTP sending failed, please try again later", 'data': [] });
//                 }
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/reset_password', [
//     check("otp", "OTP is required!").exists().not().isEmpty().isNumeric().withMessage("OTP must contains numeric values"),
//     check("newPassword", "Password is required!").exists().not().isEmpty(),
//     check("confirmPassword", "Password is required!").exists().not().isEmpty(),
// ], async (req, res) => {
//     try {
//         // const errors = validationResult(req);
//         // if (!errors.isEmpty()) {
//         //     return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         // }

//         // const { email, password, otp } = req.body;
//         // let user = await CustomersModel.findOne({ email, otp, status: 1 });
//         // if (!user) {
//         //     return res.status(500).json({ 'status': false, 'message': "Invalid User..!!", 'data': [] });
//         // }

//         // user.password = bcrypt.hashSync(password, 10);
//         // await user.save();

//         // return res.status(200).json({ 'status': true, 'message': "Password updated successfully.", 'data': [] });
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

//                 if(newPassword === confirmPassword) {

//                     user.password = bcrypt.hashSync(newPassword, 10);
//                     await user.save();

//                     return res.status(200).json({ 'status': true, 'message': "Password updated successfully.", 'data': [] });

//                 }else{
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

// router.put('/customer/update_profile', [
//     check("first_name", "First Name is required!").exists().not().isEmpty(),
//     check("last_name", "Last Name is required!").exists().not().isEmpty(),
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
//     check("jobTitle", "Job Title is required!").exists().not().isEmpty(),
//     check("country", "Country is required!").exists().not().isEmpty(),
//     check("company", "Company is required!").exists().not().isEmpty(),
// ], validate, async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (err, decoded) => {
//                 const { first_name, last_name, email, industry, jobTitle, country, phone, company } = req.body;
//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
//                 }

//                 const existingCustomer = await CustomersModel.findOne({ email });
//                 if (existingCustomer && existingCustomer._id.toString() !== decoded.userId) {
//                     return res.status(500).json({ 'status': false, 'message': "Email ID already exists.", 'data': [] });
//                 }

//                 const updatedFields = { first_name, last_name, email, jobTitle, country, phone, company };
//                 if (req.body.password) {
//                     updatedFields.password = bcrypt.hashSync(req.body.password, 10);
//                 }

//                 const options = { new: true };
//                 const updatedCustomer = await CustomersModel.findByIdAndUpdate(decoded.userId, updatedFields, options);
//                 if (!updatedCustomer) {
//                     return res.status(500).json({ 'status': false, 'message': 'User not found', 'data': [] });
//                 }

//                 return res.status(200).json({ 'status': true, 'message': "Profile data updated successfully.", 'data': { updatedCustomer } });
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.put('/customer/update_profile_image', validate, async (req, res) => {
//     try {
//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (err, decoded) => {
//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
//                 }

//                 if (req.files && Object.keys(req.files).length !== 0) {
//                     const updateBody = {};
//                     updateBody.profilePhoto = await uploadImage(req, res);

//                     const options = { new: true };
//                     const updatedCustomer = await CustomersModel.findByIdAndUpdate(decoded.userId, updateBody, options);
//                     if (!updatedCustomer) {
//                         return res.status(500).json({ 'status': false, 'message': 'User not found', 'data': [] });
//                     }

//                     return res.status(200).json({ 'status': true, 'message': "Profile data updated successfully.", 'data': [] });
//                 } else {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid Image File.", 'data': [] });
//                 }
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.get('/customer/profile', validate, async (req, res) => {
//     try {
//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (err, decoded) => {
//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 let countries = await Country.find().sort({ name: 1 });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid User.", 'data': [] });
//                 }

//                 return res.status(200).json({ 'status': true, 'message': "Profile data fetched successfully.", 'data': { user , countries} });
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.delete('/customer/delete/:userId', validate, async (req, res) => {
//     try {
//         const removedUser = await User.findByIdAndDelete(req.params.userId);
//         if (!removedUser) {
//             return res.status(404).json({ message: 'Invalid User' });
//         }

//         return res.status(200).json({ 'status': true, 'message': "User account is deleted", 'data': [] });
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.post('/customer/verify_token', async (req, res) => {
//     try {
//         if (req.headers.authorization) {
//             const token = req.headers.authorization;
//             const secretKey = process.env.ENCRYPTION_KEY;
//             const payload = jwt.verify(token, secretKey, async (err, decoded) => {
//                 let user = await CustomersModel.findOne({ _id: decoded.userId });
//                 if (!user) {
//                     return res.status(500).json({ 'status': false, 'message': "Invalid Token or Expired.", 'data': [] });
//                 }

//                 token = jwt.sign({ userId: user._id }, process.env.ENCRYPTION_KEY, { expiresIn: "30m" });

//                 const userdata = {};
//                 userdata.token = token;
//                 userdata.user = user;
//                 return res.status(200).json({ 'status': true, 'message': "Token Verified and Refreshed.!!", 'data': { userdata } });
//             });
//         } else {
//             return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': { user } });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// // Common APIs
// router.get('/business-years', async (req, res) => {
//     try {
//         let businessdata = await BusinessData.find({ status: 1 });
//         if (!businessdata) {
//             return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
//         }

//         return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { businessdata } });
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.get('/historical-trends', async (req, res) => {
//     try {
//         let historicaltrends = await HistoricalTrends.find({ status: 1 });
//         if (!historicaltrends) {
//             return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
//         }

//         return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { historicaltrends } });
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// router.get('/countries', async (req, res) => {
//     try {
//         let countries = await Country.find().sort({ name: 1 });
//         if (!countries) {
//             return res.status(500).json({ 'status': false, 'message': "No records found.", 'data': [] });
//         }

//         return res.status(200).json({ 'status': true, 'message': "Success.", 'data': { countries } });
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// // router.get('/formdata', async (req, res) => {
// //     try {
// //         const token = req.headers.authorization;
// //         const secretKey = process.env.ENCRYPTION_KEY;
// //         const payload = jwt.verify(token, secretKey, async function (error, decoded) {
// //             if (error) {
// //                 return res.status(500).json({ 'status': false, 'message': "Invalid Token.", 'data': [] });
// //             }

// //             let ActiveplanAvailable = false;
// //             let noPlan = false;

// //             // Fetch Record of User 
// //             const ActiveplanRecord = await PlanRecoredModel.findOne({ 'userId': decoded.userId, planStatusType: 'active' });
// //             if (ActiveplanRecord) {
// //                 const planCount = ActiveplanRecord.balanceQuota - ActiveplanRecord.orders.length;
// //                 if (planCount > 0) {
// //                     ActiveplanAvailable = true;
// //                 }
// //             }

// //             const AllRecords = await PlanRecoredModel.findOne({ 'userId': decoded.userId });
// //             if (AllRecords && AllRecords.length > 0) {
// //                 noPlan = true;
// //             }

// //             const PlanData = { 'ActiveplanAvailable': ActiveplanAvailable, 'noPlan': noPlan };

// //             // Fetching the required data from the database
// //             let countries = await Country.find().sort({ name: 1 });
// //             let historicaltrends = await HistoricalTrends.find({ status: 1 });
// //             let businessdata = await BusinessData.find({ status: 1 });
// //             let industries = await IndustryModel.find({ status: 1 });
// //             let subindustries = await SubIndustryModel.find({ status: 1 });
// //             let currency = await CurrencyModel.find({ status: 1 }).sort({ code: 1 });

// //             // Create a map to hold the sub-industry data grouped by industry names
// //             const subIndustryMap = {};

// //             // Loop through each sub-industry
// //             subindustries.forEach(subIndustry => {
// //                 // Find the industry associated with this sub-industry
// //                 const industry = industries.find(ind => ind._id.equals(subIndustry.industryId));
// //                 if (industry) {
// //                     const industryName = industry.name;

// //                     // Initialize the array if it doesn't exist for this industry name
// //                     if (!subIndustryMap[industryName]) {
// //                         subIndustryMap[industryName] = [];
// //                     }

// //                     // Add the sub-industry to the corresponding industry name array
// //                     subIndustryMap[industryName].push(subIndustry);
// //                 }
// //             });

// //             // Prepare the response object
// //             const responseData = {
// //                 countries,
// //                 historicaltrends,
// //                 businessdata,
// //                 industries,
// //                 subIndustries: subIndustryMap,
// //                 currency,
// //                 planData: PlanData
// //             };

// //             // Send the response
// //             return res.status(200).json({
// //                 status: true,
// //                 message: "Success.",
// //                 data: responseData
// //             });
// //         });
// //     } catch (error) {
// //         // Handle errors and send a failure response
// //         return res.status(500).json({
// //             status: false,
// //             message: error.message,
// //             data: []
// //         });
// //     }
// // });
// router.get('/formdata', async (req, res) => {
//     try {
//         const token = req.headers.authorization;
//         const secretKey = process.env.ENCRYPTION_KEY;

//         const decoded = jwt.verify(token, secretKey);

//         const [activePlan, allRecords, countries, historicaltrends, businessdata, industries, subindustries, currency] = await Promise.all([
//             PlanRecoredModel.findOne({ userId: decoded.userId, planStatusType: 'active' }).lean(),
//             PlanRecoredModel.find({ userId: decoded.userId }).lean(),
//             Country.find().sort({ name: 1 }).lean(),
//             HistoricalTrends.find({ status: 1 }).lean(),
//             BusinessData.find({ status: 1 }).lean(),
//             IndustryModel.find({ status: 1 }).lean(),
//             SubIndustryModel.find({ status: 1 }).lean(),
//             CurrencyModel.find({ status: 1 }).sort({ code: 1 }).lean(),
//         ]);

//         const ActiveplanAvailable = activePlan && activePlan.balanceQuota - activePlan.orders.length > 0 ? true : false;
//         const noPlan = allRecords && allRecords.length > 0 ? true : false;

//         // Map sub-industries to industries
//         const industryMap = industries.reduce((map, industry) => {
//             map[industry._id.toString()] = industry.name;
//             return map;
//         }, {});

//         const subIndustryMap = subindustries.reduce((map, subIndustry) => {
//             const industryName = industryMap[subIndustry.industryId.toString()];
//             if (industryName) {
//                 if (!map[industryName]) {
//                     map[industryName] = [];
//                 }
//                 map[industryName].push(subIndustry);
//             }
//             return map;
//         }, {});

//         const responseData = {
//             countries,
//             historicaltrends,
//             businessdata,
//             industries,
//             subIndustries: subIndustryMap,
//             currency,
//             planData: { ActiveplanAvailable, noPlan },
//         };

//         return res.status(200).json({ status: true, message: "Success.", data: responseData });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message, data: [] });
//     }
// });

// function generateOTP(limit = 4) {
//     let digits = "0123456789";
//     let code = "";
//     for (let i = 0; i <= limit; i++) {
//         code += digits[Math.floor(Math.random() * 10)];
//     }

//     return code;
// }

// function uploadImage(req, res) {
//     return new Promise((resolve, reject) => {
//         let profilePhoto = req.files.profilePhoto;
//         const fileName = req.files.profilePhoto.name;
//         profilePhoto.mv("../../../uploads/customer/" + fileName,
//             function (error) {
//                 if (error) {
//                     return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//                 }

//                 resolve(fileName);
//             }
//         );
//     });
// }

// router.get('/customer/plan', validate, async (req, res) => {
//     try {
//         const token = req.headers.authorization;

//         if (!token) {
//             return res.status(401).json({ status: false, message: "Invalid Token.", data: [] });
//         }

//         const secretKey = process.env.ENCRYPTION_KEY;
//         const decoded = jwt.verify(token, secretKey);

//         const user = await CustomersModel.findById(decoded.userId);
//         if (!user) {
//             return res.status(404).json({ status: false, message: "Invalid User.", data: [] });
//         }

//         const [bopPlan, boPlan] = await Promise.all([
//             PlanModel.findOne({ planType: 'BOP', status: 1 }),
//             PlanModel.findOne({ planType: 'BO', status: 1 })
//         ]);

//         const bopPrice = bopPlan ? bopPlan.price : 0;
//         const boPrice = boPlan ? boPlan.price : 0;
//         const upgradePrice = bopPrice - boPrice;
//         const isUpgradeAvailable = user.activePlanType === 'BO';

//         const responseData = {
//             upgrade: isUpgradeAvailable,
//             price: isUpgradeAvailable ? upgradePrice : 0,
//             currentPlan: user.activePlanType
//         };

//         return res.status(200).json({ status: true, message: "Plan Data Fetched Successfully.", data: responseData });

//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message, data: [] });
//     }
// });

// router.post('/customer/send_testmail', [
//     check("email", "Email ID is required!").exists().not().isEmpty().isEmail().withMessage("Invalid Email ID"),
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(500).json({ status: false, message: errors.array()[0].msg, 'data': [] });
//         }

//         const { email } = req.body;
//         let otp = generateOTP(4);
//         let html = await EmailTemplate.otpTemplate(otp, "Developer");
//         let result = await EmailTemplate.sendMail({
//             email: email,
//             subject: await EmailTemplate.fetchSubjectTemplate(1),
//             application_name: "FinVal",
//             text: "",
//             html: html
//         });

//         if (result) {
//             return res.status(200).json({ 'status': true, 'message': "OTP Sent", 'data': [] });
//         } else {
//             return res.status(200).json({ 'status': false, 'message': "Something went wrong, please try again later", 'data': [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ 'status': false, 'message': error.message, 'data': [] });
//     }
// });

// module.exports = router;
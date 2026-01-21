const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ContactModel = require('../../../models/ContactModel');

// Submit contact form
router.post('/contact/submit', [
    check("full_name", "Full Name is required").exists().not().isEmpty().trim(),
    check("company_name", "Company Name is required").exists().not().isEmpty().trim(),
    check("email", "Email is required").exists().not().isEmpty().isEmail().withMessage("Invalid Email"),
    check("country_of_operation", "Country of Operation is required").exists().not().isEmpty().trim(),
    check("message", "Message is optional").optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                status: false,
                message: errors.array()[0].msg,
                data: []
            });
        }

        const { full_name, company_name, email, country_of_operation, message } = req.body;

        // Check if contact already exists with same email and company
        const existingContact = await ContactModel.findOne({
            email,
            company_name
        });

        if (existingContact) {
            return res.status(200).json({
                status: false,
                message: "You have already submitted a contact request with this email and company.",
                data: []
            });
        }

        const contact = new ContactModel({
            full_name,
            company_name,
            email,
            country_of_operation,
            message: message || ''
        });

        const savedContact = await contact.save();

        if (savedContact) {
            // ✅ UNCOMMENT AND IMPLEMENT EMAIL SENDING HERE
            try {
                // First, create the email templates file if not exists
                // Create a simple email sending function
                const nodemailer = require('nodemailer');

                // Create transporter
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                // HTML email template for admin
                const adminHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                        .content { background: #f9f9f9; padding: 20px; }
                        .field { margin-bottom: 10px; }
                        .label { font-weight: bold; color: #555; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📧 New Contact Form Submission</h1>
                        </div>
                        <div class="content">
                            <p>A new enquiry has been submitted:</p>
                            
                            <div class="field">
                                <span class="label">Full Name:</span>
                                <span>${full_name}</span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Company:</span>
                                <span>${company_name}</span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Email:</span>
                                <span><a href="mailto:${email}">${email}</a></span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Country:</span>
                                <span>${country_of_operation}</span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Message:</span>
                                <p>${message || 'No message provided'}</p>
                            </div>
                            
                            <div class="field">
                                <span class="label">Date:</span>
                                <span>${new Date().toLocaleString()}</span>
                            </div>
                            
                            <div class="field">
                                <span class="label">Contact ID:</span>
                                <span>${savedContact.contact_id}</span>
                            </div>
                            
                            <hr>
                            <p><strong>Action Required:</strong> Please respond to this enquiry within 24 hours.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                // Send email to admin
                const adminMailOptions = {
                    from: process.env.SMTP_FROM || `"Contact Form" <${process.env.SMTP_USER}>`,
                    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Admin email
                    subject: `New Contact Form Submission - ${full_name} from ${company_name}`,
                    html: adminHtml
                };

                await transporter.sendMail(adminMailOptions);
                console.log('✅ Admin notification email sent');

                // Optional: Send confirmation email to user
                const userHtml = `
                <!DOCTYPE html>
                <html>
                <body>
                    <h2>Thank You for Contacting Us!</h2>
                    <p>Dear ${full_name},</p>
                    <p>We have received your enquiry and will get back to you within 24-48 hours.</p>
                    <p><strong>Reference ID:</strong> ${savedContact.contact_id}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
                    <br>
                    <p>Best regards,<br>Support Team</p>
                </body>
                </html>
                `;

                const userMailOptions = {
                    from: process.env.SMTP_FROM || `"Contact Form" <${process.env.SMTP_USER}>`,
                    to: email, // User's email
                    subject: 'Thank You for Contacting Us',
                    html: userHtml
                };

                await transporter.sendMail(userMailOptions);
                console.log('✅ User confirmation email sent');

            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                // Don't fail the entire request if email fails
                // Just log the error and continue
            }

            return res.status(200).json({
                status: true,
                message: "Contact form submitted successfully. We'll get back to you soon.",
                data: {
                    contact_id: savedContact.contact_id,
                    full_name: savedContact.full_name,
                    email: savedContact.email,
                    company_name: savedContact.company_name
                }
            });
        }

        return res.status(200).json({
            status: false,
            message: "Failed to submit contact form. Please try again.",
            data: []
        });

    } catch (error) {
        console.error("Contact Form Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message,
            data: []
        });
    }
});

// Get all contacts (admin)
router.get('/contact/all', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status !== undefined) {
            query.status = parseInt(status);
        }

        const contacts = await ContactModel.find(query)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await ContactModel.countDocuments(query);

        return res.status(200).json({
            status: true,
            message: "Contacts retrieved successfully",
            data: {
                contacts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalContacts: total,
                    hasNextPage: page * limit < total,
                    hasPreviousPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error("Get Contacts Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message,
            data: []
        });
    }
});

// Get single contact by ID
router.get('/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await ContactModel.findOne({
            $or: [
                { _id: id },
                { contact_id: parseInt(id) || 0 }
            ]
        }).select('-__v');

        if (!contact) {
            return res.status(200).json({
                status: false,
                message: "Contact not found",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Contact retrieved successfully",
            data: { contact }
        });

    } catch (error) {
        console.error("Get Contact Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message,
            data: []
        });
    }
});

// Update contact status (admin)
// router.put('/contact/status/:id', [
//     check("status", "Status is required").exists().isInt({ min: 0, max: 2 }).withMessage("Status must be 0, 1, or 2")
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(200).json({ 
//                 status: false, 
//                 message: errors.array()[0].msg, 
//                 data: [] 
//             });
//         }

//         const { id } = req.params;
//         const { status } = req.body;

//         const contact = await ContactModel.findOneAndUpdate(
//             { 
//                 $or: [
//                     { _id: id },
//                     { contact_id: parseInt(id) || 0 }
//                 ]
//             },
//             { 
//                 status: parseInt(status),
//                 updated_at: Date.now()
//             },
//             { new: true }
//         ).select('-__v');

//         if (!contact) {
//             return res.status(200).json({ 
//                 status: false, 
//                 message: "Contact not found", 
//                 data: [] 
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Contact status updated successfully",
//             data: { contact }
//         });

//     } catch (error) {
//         console.error("Update Contact Error:", error);
//         return res.status(500).json({ 
//             status: false, 
//             message: error.message, 
//             data: [] 
//         });
//     }
// });

// Delete contact (admin)
// router.delete('/contact/delete/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         const contact = await ContactModel.findOneAndDelete({ 
//             $or: [
//                 { _id: id },
//                 { contact_id: parseInt(id) || 0 }
//             ]
//         });

//         if (!contact) {
//             return res.status(200).json({ 
//                 status: false, 
//                 message: "Contact not found", 
//                 data: [] 
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Contact deleted successfully",
//             data: { contact_id: contact.contact_id }
//         });

//     } catch (error) {
//         console.error("Delete Contact Error:", error);
//         return res.status(500).json({ 
//             status: false, 
//             message: error.message, 
//             data: [] 
//         });
//     }
// });

module.exports = router;
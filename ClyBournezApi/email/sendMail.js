const nodemailer = require("nodemailer");
require('dotenv').config();
const cors = require('cors');
const EmailTemplate = require('../models/emailtemplates.model');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const mailLayout = (setting = { }, html = "") => {
    return `
    <!DOCTYPE html>
    <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>${setting?.subject}</title>
            <meta name="description" content="${setting?.subject}." />
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300, 400, 500, 700|Open + Sans:300, 400, 600, 700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width: 95%; margin: 0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                            <tr><td style="height: 40px;">&nbsp;</td></tr>
                            <tr>
                                <td style="text-align: center; font-size: 30px;">
                                    <a href="${process.env.CLIENT_BASEURL}" title="${setting?.application_name}" target="_blank">
                                        <img width="180" src="${setting?.logo}" title="${setting?.application_name}" alt="${setting?.application_name}" />
                                    </a>
                                </td>
                            </tr>
                            <tr><td style="height: 20px;">&nbsp;</td></tr>
                            <tr>
                                <td>
                                    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width: 90%; background: #fff; border-radius: 3px; text-align: left;
                                            -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                            -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                            box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);">

                                        <tr><td style="height: 40px;">&nbsp;</td></tr>
                                        ${html}
                                        <tr><td style="height: 40px;">&nbsp;</td></tr>
                                    </table>
                                </td>
                            </tr>
                            <tr><td style="height: 20px;">&nbsp;</td></tr>
                            <tr>
                                <td style="text-align: center;">
                                    <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0;">
                                        &copy; <strong>${setting?.application_name}</strong><br />
                                        <small>${setting?.address}</small>
                                    </p>
                                </td>
                            </tr>
                            <tr><td style="height: 40px;">&nbsp;</td></tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>`
}

// exports.sendMail = async ({ email, subject, application_name = "", text = "", html = "", attachments = [] }) => {
//     try {
//         var setting_data = {
//             smtp_host: `${process.env.SMTP_HOST}`,
//             smtp_port: `${process.env.SMTP_PORT}`,
//             smtp_user: `${process.env.SMTP_USER}`,
//             smtp_pass: `${process.env.SMTP_PASS}`,
//             logo: `${process.env.BASEURL}uploads/logo.png`,
//             application_name: application_name,
//             email_from: `${process.env.FROM_EMAIL}`,
//             subject: subject,
//             from_name: `${process.env.FROM_NAME}`,  // Add FROM_NAME here
//             attachments: attachments
//         }

//         let transporter = nodemailer.createTransport({
//             host: setting_data.smtp_host,
//             port: setting_data.smtp_port,
//             secure: [465, 587].includes(parseInt(setting_data.smtp_port)), // true for 465, false for other ports
//             auth: {
//                 user: setting_data.smtp_user,
//                 pass: setting_data.smtp_pass,
//             },
//         });    

//         // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from: `"${setting_data.from_name}" <${process.env.FROM_EMAIL}>`,
//             to: email,
//             subject: subject,
//             text: text,
//             html: mailLayout(setting_data, html),
//             attachments: attachments, // Add attachments here
//             contentType: 'text/html'
//         });

//         // console.log(info);
//         return info.messageId;
//     } catch (error) {
//         return error;
//     }
// }

exports.sendMail = async ({ email, subject, application_name = "", text = "", html = "", attachments = [] }) => {
    try {
        // Validate inputs
        if (!validator.isEmail(email)) throw new Error('Invalid email address');
        if (!subject || typeof subject !== 'string') throw new Error('Invalid subject');
        html = sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src', 'alt'],
            },
        });
        

        const validateAttachments = (attachments) => {
            return attachments.every(att => att.path && att.filename && att.path.endsWith('.pdf')); // Example validation
        };

        if (!validateAttachments(attachments)) throw new Error('Invalid attachments');

        // SMTP settings
        var setting_data = {
            smtp_host: process.env.SMTP_HOST,
            smtp_port: parseInt(process.env.SMTP_PORT),
            smtp_user: process.env.SMTP_USER,
            smtp_pass: process.env.SMTP_PASS,
            logo: `${process.env.BASEURL}uploads/logo.png`,
            application_name: application_name,
            email_from: process.env.FROM_EMAIL,
            subject: subject,
            from_name: process.env.FROM_NAME,
            attachments: attachments
        };

        let transporter = nodemailer.createTransport({
            host: setting_data.smtp_host,
            port: setting_data.smtp_port,
           secure: [465].includes(parseInt(setting_data.smtp_port)), // 587- Force secure connections
            auth: {
                user: setting_data.smtp_user,
                pass: setting_data.smtp_pass,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        // Send email
        let info = await transporter.sendMail({
            from: `"${setting_data.from_name}" <${setting_data.email_from}>`,
            to: email,
            subject: subject,
            text: text,
            html: mailLayout(setting_data, html),
            attachments: attachments,
            contentType: 'text/html'
        });

        return info.messageId;

    } catch (error) {
        console.log(error)
        return null;
    }
};


exports.otpTemplate = async (otp = "", customer = "", portal_url = "") => {
    const variables = { customer, otp, portal_url };
    const body = await fetchTemplate(1, variables);    
    return body;
}

exports.accountVerificationTemplate = async (verification_link = "", customer = "", contact_email = "") => {
    const variables = { customer, contact_email, verification_link };
    const body = await fetchTemplate(2, variables);
    return body;
}

exports.documentUploadConfirmation = async (contact_email = "", customer = "") => {
    const variables = { customer, contact_email };
    const body = await fetchTemplate(3, variables);
    return body;
}

exports.reportSubmitWithoutDocument = async (report_due_date = "", customer = "", company_name = "", contact_email="") => {
    const variables = { customer, report_due_date, company_name, contact_email };
    const body = await fetchTemplate(4, variables);
    return body;
}

exports.reportSubmitWithDocument = async (customer = "", company_name = "", contact_email="") => {
    const variables = { customer, company_name, contact_email };
    const body = await fetchTemplate(5, variables);
    return body;
}

exports.reportSubmitConfirmation = async (report_due_date = "", customer = "", company_name = "", contact_email="") => {
    const variables = { customer, report_due_date, company_name, contact_email };
    const body = await fetchTemplate(6, variables);
    return body;
}

exports.planUpgrade = async (amount = 0, customer = "", report_count = 0, access_days = 0, price = 0, previous_plan_number = 0, current_plan_number = 0, new_report_count = 0, new_access_days = 0, expire_date = '') => {
    const variables = { customer, amount, report_count, access_days, price, previous_plan_number, current_plan_number, new_report_count, new_access_days, expire_date };
    const body = await fetchTemplate(7, variables);
    return body;
}

exports.otpChangeTemplate = async (otp = "", customer = "", portal_url = "") => {
    const variables = { customer, otp, portal_url };
    const body = await fetchTemplate(8, variables);
    return body;
}

exports.registrationSuccess = async (email = "", customer = "") => {
    const variables = { customer, email };
    const body = await fetchTemplate(9, variables);
    return body;
}

exports.newPlanPurchase = async (price = 0, customer = "", portal_url = "") => {
    const variables = { customer, price, portal_url };
    const body = await fetchTemplate(10, variables);
    return body;
}

exports.inititalReportSubmit = async (customer = "", company_name = "") => {
    const variables = { customer,  company_name };
    const body = await fetchTemplate(11, variables);
    return body;
}

exports.revisedReportSent = async (customer = "", company_name = "") => {
    const variables = { customer, company_name };
    const body = await fetchTemplate(12, variables);
    return body;
}

exports.invoiceSent = async (customer = "", plan_id = "", plan_purchase_date = "") => {
    const variables = { customer, plan_id, plan_purchase_date };
    const body = await fetchTemplate(13, variables);
    return body;
}

exports.adminUserPassowrd = async (username = "", user_id = "", password = "", role= "", portal_url = "") => {
    const variables = { username, user_id, password, role, portal_url };
    const body = await fetchTemplate(14, variables);
    return body;
}

exports.bopAdminOrderSubmit = async (username = "", user_id = "", password = "", role= "", portal_url = "") => {
    const variables = { username, user_id, password, role, portal_url };
    const body = await fetchTemplate(14, variables);
    return body;
}

exports.adminOrderSubmit = async (report_due_date = "", customer = "", company_name = "", contact_email="") => {
    const variables = { customer, report_due_date, company_name, contact_email };
    const body = await fetchTemplate(15, variables);
    return body;
}

async function fetchTemplate(template = '', variables = {}) {
    try {
        // Fetching the email template asynchronously
        const emailtemplate = await EmailTemplate.findOne({ templateId: parseInt(template) });
        const description = emailtemplate ? emailtemplate.description : '';
        if (description.length) {
            // Replacing variables in the template body
            const body = description.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
                return variables[key] || ''; // Replace with variable or empty string if not found
            });

            const outputString = body.replace(/<p>&lt;/g, '<')
            .replace(/&gt;<\/p>/g, '>')
            .replace(/&lt;b&gt;/g, '<b>')
            .replace(/&lt;\/b&gt;/g, '</b>')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
            return outputString;
        }

        return description;
    } catch (error) {
        console.error("Error fetching template:", error); // Log the error for debugging
        return ''; // Return an empty string if there is an error
    }
}


exports.fetchSubjectTemplate = async (template = 0) => {
    try {
        // Fetch the email template asynchronously
        const emailtemplate = await EmailTemplate.findOne({ templateId: parseInt(template) }).limit(1);
        const subject = emailtemplate ? emailtemplate.subject : '';
        return subject;
    } catch (error) {
        console.error("Error fetching subject template:", error);
        return ''; // Return an empty string in case of an error
    }
};

exports.forgotPasswordTemplate = (link, name, contactEmail) => {
  return `
    <p>Hello ${name},</p>
    <p>You recently requested to reset your password for your FinVal account.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${link}" style="color:#1aa79c;">Reset Password</a></p>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn’t request a password reset, please ignore this email.</p>
    <p>Need help? Contact us at <a href="mailto:${contactEmail}">${contactEmail}</a></p>
  `;
};
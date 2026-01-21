const nodemailer = require('nodemailer');
const EmailTemplates = require('../templates/emailTemplates');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    /**
     * Send email
     */
    async sendEmail(to, subject, html, from = null) {
        try {
            const mailOptions = {
                from: from || process.env.SMTP_FROM || `"Contact Form" <${process.env.SMTP_USER}>`,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject: subject,
                html: html,
                text: html.replace(/<[^>]*>/g, '') // Fallback text version
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return {
                success: true,
                messageId: info.messageId,
                response: info.response
            };
        } catch (error) {
            console.error('Email sending error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send admin notification about new contact
     */
    async sendAdminNotification(contactData) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
            
            if (!adminEmail) {
                console.error('Admin email not configured');
                return { success: false, error: 'Admin email not configured' };
            }

            const html = EmailTemplates.generateAdminNotification(contactData);
            const subject = EmailTemplates.getAdminSubject();

            return await this.sendEmail(adminEmail, subject, html);
        } catch (error) {
            console.error('Admin notification error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send confirmation email to user
     */
    async sendUserConfirmation(contactData) {
        try {
            const html = EmailTemplates.generateUserConfirmation(contactData);
            const subject = EmailTemplates.getUserSubject();

            return await this.sendEmail(contactData.email, subject, html);
        } catch (error) {
            console.error('User confirmation error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send both admin notification and user confirmation
     */
    async sendContactNotifications(contactData) {
        const results = {
            admin: null,
            user: null
        };

        // Send admin notification
        results.admin = await this.sendAdminNotification(contactData);
        
        // Send user confirmation
        results.user = await this.sendUserConfirmation(contactData);

        return results;
    }

    /**
     * Test email connection
     */
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('SMTP Connection verified successfully');
            return { success: true, message: 'SMTP Connection verified' };
        } catch (error) {
            console.error('SMTP Connection failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create singleton instance
const emailService = new EmailService();
module.exports = emailService;
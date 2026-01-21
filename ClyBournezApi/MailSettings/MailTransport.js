const nodemailer = require('nodemailer');
require('dotenv').config();
const mail=nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

});

module.exports=mail;
//This is the mail transport which is used to send mails to the users.
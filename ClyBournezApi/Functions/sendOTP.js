const mail=require('../MailSettings/MailTransport');

const sendOtp=async(email,otp)=>{
   
    const mailOptions={
        from:'portal@fin-advisors.com',
        to:email,
        subject:'OTP',
        text:otp
    };
    await mail.sendMail(mailOptions);
}

module.exports=sendOtp;
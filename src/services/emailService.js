const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth
});

const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: to,
    subject: 'Verify Your Email',
    html: `<p>Thank you for registering with us. Please verify your email by clicking on the link below:</p>
               <a href="http://localhost:3300/verify-email?token=${token}">Verify Email</a>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Failed to send verification email', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { sendVerificationEmail };

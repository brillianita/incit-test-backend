const nodemailer = require('nodemailer');


const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: to,
    subject: 'Verify Your Email',
    html: `<p>Thank you for registering with us. Please verify your email by clicking on the link below:</p>
               <a href="${process.env.BASE_URL}/verify-email?token=${token}">Verify Email</a>`
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
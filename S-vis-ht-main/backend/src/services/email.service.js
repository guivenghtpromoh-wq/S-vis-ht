const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOTPEmail = async (to, code) => {
  if (!process.env.SMTP_USER) {
    console.log(`[DEV MODE] OTP pou ${to} se: ${code}`);
    return;
  }
  await transporter.sendMail({
    from: `"SÈVIS-HT" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Kòd Verifikasyon SÈVIS-HT',
    text: `Kòd verifikasyon ou se: ${code}`,
  });
};

module.exports = { sendOTPEmail };

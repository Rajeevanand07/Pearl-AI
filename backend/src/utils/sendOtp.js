const nodemailer = require("nodemailer");

async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is ${otp}. It expires in 5 minutes.`,
  };

  const isEmailSent = await transporter.sendMail(mailOptions)
  .then(() => {
    console.log("Email sent successfully");
    return true;
  })
  .catch((error) => {
    console.log(error);
    return false;
  });
  
  return isEmailSent;
}

module.exports = { sendOtpEmail };

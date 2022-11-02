const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.PORT,
      port: 587,
      secure: true,
      auth: {
        user: process.env.HOST,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.HOST,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.log(error);
  }
};

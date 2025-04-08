import transport from "../config/emailConfig.js";

const sendMail = async (email, subject, message) => {
  const mailOptions = {
    from: `"Support Team" <${process.env.MY_GMAIL}>`,
    to: email,
    subject: subject,
    html: message,
  };
  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email", error);
  }
};

export default sendMail;

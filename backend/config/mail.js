import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//helper
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendMail = async (req, res) => {
  try {
    const { to: mentorEmail, from: userEmail, subject, message } = req.body;

    if (!mentorEmail || !userEmail || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await transporter.sendMail({
      from: `"SkillMatch.AI Platform" <${process.env.EMAIL}>`,
      to: mentorEmail,
      subject: subject,
      replyTo: userEmail,
      html: `
        <div style="font-family:sans-serif;">
          <h3>New Message from ${userEmail}</h3>
          <p>${message}</p>
          <hr/>
          <small>This message was sent via SkillMatch.AI</small>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};


export const feedBackMail = async (req, res) => {
  try {
    const { from: userEmail, message } = req.body;
    if (!message) {
      return res.status(404).json({ message: "please send email data" });
    }

    await transporter.sendMail({
      from: userEmail,
      to: process.env.EMAIL,
      subject: "SkillMatch.AI Footer Subscription",
      html: `
        <div style="font-family:sans-serif;">
          <h3>New Subscription from ${userEmail}</h3>
          <p>${message}</p>
          <hr/>
          <small>This message was sent via SkillMatch.AI Footer Form</small>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "failed to send mail", error: error.message });
  }
};

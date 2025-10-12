

import cron from "node-cron";
import nodemailer from "nodemailer";
import Session from "../models/sessionModel.js";
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

transporter.verify((err) => {
  if (err) console.error("❌ Email Transporter Error:", err);
  else console.log("✅ Email transporter is ready");
});


function getSessionDateTime(session) {
  if (!session.sessionTime?.length) return null;
  const { date, time } = session.sessionTime[0];
  if (!date || !time) return null;

  const [hours, minutes] = time.split(":").map(Number);
  const sessionDate = new Date(date);
  sessionDate.setHours(hours);
  sessionDate.setMinutes(minutes);
  sessionDate.setSeconds(0);
  sessionDate.setMilliseconds(0);
  return sessionDate;
}


cron.schedule("* * * * *", async () => {
  const now = new Date();
  

  try {
    const sessions = await Session.find()
      .populate("user", "email username")
      .populate({
        path: "mentor",
        populate: { path: "user", select: "email username" },
      });

    for (const session of sessions) {
      const sessionDateTime = getSessionDateTime(session);
      if (!sessionDateTime) continue;

      const diffMs = sessionDateTime - now;
      const diffMinutes = diffMs / (1000 * 60);

      
      if (diffMinutes <= 15 && diffMinutes > 14 && !session.fifteenMinReminderSent) {
        const userEmail = session.user.email;
        const mentorEmail = session.mentor?.user?.email;

       

        await transporter.sendMail({
          from: `"SkillMatch.AI" <${process.env.EMAIL}>`,
          to: userEmail,
          subject: "⏰ Reminder: Session in 15 minutes",
          html: `<p>Hi ${session.user.username},</p>
                 <p>Your session with <b>${session.mentor.user.username}</b> starts in 15 minutes.</p>`,
        });

        await transporter.sendMail({
          from: `"SkillMatch.AI" <${process.env.EMAIL}>`,
          to: mentorEmail,
          subject: "⏰ Reminder: Session in 15 minutes",
          html: `<p>Hi ${session.mentor.user.username},</p>
                 <p>Your session with <b>${session.user.username}</b> starts in 15 minutes.</p>`,
        });

        session.fifteenMinReminderSent = true;
        await session.save();
      }

      
      if (Math.abs(diffMinutes) < 1 && !session.isReminderSent) {
        const userEmail = session.user.email;
        const mentorEmail = session.mentor?.user?.email;

      

        await transporter.sendMail({
          from: `"SkillMatch.AI" <${process.env.EMAIL}>`,
          to: userEmail,
          subject: "🚀 Your session is starting now!",
          html: `<p>Hi ${session.user.username},</p>
                 <p>Your session with <b>${session.mentor.user.username}</b> is starting now. Head to your dashboard to join.</p>`,
        });

        await transporter.sendMail({
          from: `"SkillMatch.AI" <${process.env.EMAIL}>`,
          to: mentorEmail,
          subject: "🚀 Your session is starting now!",
          html: `<p>Hi ${session.mentor.user.username},</p>
                 <p>Your session with <b>${session.user.username}</b> is starting now. Go to your dashboard to begin.</p>`,
        });

        session.isReminderSent = true;
        await session.save();
      }
    }
  } catch (err) {
    console.error("❌ Error in reminder cron:", err);
  }
});

import cron from "node-cron";
import nodemailer from "nodemailer";
import Session from "../models/sessionModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// helper: ensure mongoose connection is ready (try connect once if URI present)
async function ensureMongooseReady(timeoutMs = 10000) {
  if (mongoose.connection.readyState === 1) return;
  if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      // proceed to wait and potentially time out
    }
  }
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    const onReady = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      mongoose.connection.removeListener("connected", onReady);
      mongoose.connection.removeListener("open", onReady);
      reject(new Error(`Mongoose not ready after ${timeoutMs}ms`));
    }, timeoutMs);
    mongoose.connection.once("connected", onReady);
    mongoose.connection.once("open", onReady);
  });
}

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
  // wait for DB; skip this run if not ready
  try {
    await ensureMongooseReady(10000);
  } catch (err) {
    console.error("❌ Skipping reminder cron: DB not ready:", err.message);
    return;
  }

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

      if (
        diffMinutes <= 15 &&
        diffMinutes > 14 &&
        !session.fifteenMinReminderSent
      ) {
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

import cron from "node-cron";
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
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
      // continue to wait; will report if not ready within timeout
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

// Run every minute helper
cron.schedule("* * * * *", async () => {
  // wait for DB; skip this run if not ready
  try {
    await ensureMongooseReady(10000);
  } catch (err) {
    console.error(
      "❌ Skipping session status update: DB not ready:",
      err.message
    );
    return;
  }

  const now = new Date();

  try {
    const sessions = await Session.find({ status: "upcoming" });

    for (const session of sessions) {
      if (!session.sessionTime || session.sessionTime.length === 0) continue;
      const { date, time } = session.sessionTime[0];
      if (!date || !time) continue;

      const [hours, minutes] = time.split(":").map(Number);
      const sessionDateTime = new Date(date);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      // 15 minutes after session start for auto-cancel
      const fifteenMinutesLater = new Date(
        sessionDateTime.getTime() + 15 * 60 * 1000
      );

      // If one or both never joined and 15 mins passed → cancel
      if (
        (!session.userJoinedAt || !session.mentorJoinedAt) &&
        now >= fifteenMinutesLater
      ) {
        session.status = "cancelled";
        await session.save();
        console.log(`❌ Session ${session._id} marked as cancelled`);
      }

      // If both joined → check overlapping duration
      if (session.userJoinedAt && session.mentorJoinedAt) {
        const overlapStart =
          session.userJoinedAt > session.mentorJoinedAt
            ? session.userJoinedAt
            : session.mentorJoinedAt;
        const durationInSeconds = (now - overlapStart) / 1000;

        if (durationInSeconds >= 60 && session.status !== "completed") {
          session.status = "completed";
          await session.save();
          console.log(`✅ Session ${session._id} marked as completed`);
        }
      }
    }
  } catch (error) {
    console.error("Error updating session statuses:", error);
  }
});

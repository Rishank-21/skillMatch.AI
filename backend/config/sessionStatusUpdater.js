


import cron from "node-cron";
import Session from "../models/sessionModel.js";

// Run every minute helper
cron.schedule("* * * * *", async () => {
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
      const fifteenMinutesLater = new Date(sessionDateTime.getTime() + 15 * 60 * 1000);

      // If one or both never joined and 15 mins passed → cancel
      if ((!session.userJoinedAt || !session.mentorJoinedAt) && now >= fifteenMinutesLater) {
        session.status = "cancelled";
        await session.save();
        console.log(`❌ Session ${session._id} marked as cancelled`);
      }

      // If both joined → check overlapping duration
      if (session.userJoinedAt && session.mentorJoinedAt) {
        const overlapStart = session.userJoinedAt > session.mentorJoinedAt ? session.userJoinedAt : session.mentorJoinedAt;
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


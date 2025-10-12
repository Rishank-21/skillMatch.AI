import { validationResult } from "express-validator";
import Session from "../models/sessionModel.js";
import stripe from "../config/stripe.js";
import Auth from "../models/authModel.js";
import Mentor from "../models/mentorModel.js";
import mongoose from "mongoose";

export const createSession = async (req, res) => {
  try {
    const { userId, mentorId, sessionTime, amountInCents } = req.body;

    // Validate input
    if (!userId || !mentorId || !sessionTime || !Array.isArray(sessionTime)) {
      return res.status(400).json({ error: "Missing session data" });
    }

    if (!amountInCents || isNaN(amountInCents)) {
      return res.status(400).json({ error: "Invalid amountInCents" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Mentorship Session" },
            unit_amount: Math.round(amountInCents),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        mentorId,
        sessionTime: JSON.stringify(sessionTime),
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    console.log("Stripe Checkout Session Created:", session.metadata);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const fetchSessionDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe Session Retrieved:", stripeSession);

    if (stripeSession.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed yet" });
    }

    const metadata = stripeSession.metadata || {};
    const { userId, mentorId, sessionTime } = metadata;

    if (!userId || !mentorId || !sessionTime) {
      return res
        .status(400)
        .json({ error: "Stripe session metadata missing or incomplete" });
    }
    const existingSession = await Session.findOne({ stripePayment: sessionId });
    if (existingSession) {
      return res.json({
        message: "Session already exists",
        session: existingSession,
      });
    }
    const parsedSessionTime = JSON.parse(sessionTime);
    const amountPaid = stripeSession.amount_total / 100;

    const newSession = await Session.create({
      user: userId,
      mentor: mentorId,
      sessionTime: parsedSessionTime,
      status: "upcoming",
      stripePayment: sessionId,
      amountPaid,
    });

    res.json({ message: "Session saved successfully", session: newSession });
  } catch (error) {
    console.error("Stripe verification error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllSessions = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await Auth.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sessions = await Session.find({ user: userId })
      .populate({
        path: "user",
        select: "username email",
      })
      .populate({
        path: "mentor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .exec(); // find all sessions for user
    if (sessions.length === 0)
      return res.status(404).json({ message: "No sessions found" });

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    return res.status(500).json({ message: "Error during fetching sessions" });
  }
};

export const joinSession = async (req, res) => {
  const { sessionId } = req.body;
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ message: "sessin not found" });
  if (session.status === "cancelled") {
    return res
      .status(400)
      .json({ message: "cannot join , session is cancelled" });
  }
  session.joined = true;
  await session.save();
  res.status(200).json({ message: "you joined the session successfully" });
};

export const fetchAllMentorSessions = async (req, res) => {
  const userId = req.user.id; // Auth user ID (not mentor ID)

  try {
    // Find mentor document linked to this user helper
    const mentor = await Mentor.findOne({ user: userId }).populate("user");
    if (!mentor)
      return res
        .status(404)
        .json({ message: "Mentor not found for this user" });

    // Now find all sessions for this mentor
    const sessions = await Session.find({ mentor: mentor._id })
      .populate({
        path: "user",
        select: "username email",
      })
      .populate({
        path: "mentor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .exec();

    if (sessions.length === 0)
      return res
        .status(404)
        .json({ message: "No sessions found for this mentor" });

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ Error fetching mentor sessions:", error.message);
    return res
      .status(500)
      .json({ message: "Error during fetching mentor sessions" });
  }
};

// Helper: mask credentials in the URI for safe logging
function maskMongoUri(uri) {
  if (!uri || typeof uri !== "string") return "<not set>";
  try {
    // mongodb+srv or mongodb://
    const withoutCreds = uri.replace(/\/\/(.*@)/, "//<credentials>@");
    // show only host portion for clarity
    const hostPart = withoutCreds.split("//")[1] || withoutCreds;
    return hostPart.length > 80 ? hostPart.slice(0, 80) + "..." : hostPart;
  } catch (e) {
    return "<invalid uri>";
  }
}

// Ensure mongoose connection is ready before running queries, with improved diagnostics
async function waitForMongooseReady(timeoutMs = 10000) {
  if (mongoose.connection.readyState === 1) return;
  return new Promise((resolve, reject) => {
    let settled = false;
    const onReady = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      mongoose.connection.removeListener("connected", onReady);
      mongoose.connection.removeListener("open", onReady);

      // Diagnostic info to help fix ECONNREFUSED
      const readyState = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
      const uri =
        process.env.MONGO_URI || process.env.MONGODB_URI || "<not set>";
      const masked = maskMongoUri(uri);

      const err = new Error(
        `Mongoose connection not ready after ${timeoutMs}ms (readyState=${readyState}). ` +
          `Check MONGO_URI: ${masked}. ` +
          `Common fixes: start mongod, ensure host/port are correct, allowlist IP (Atlas), or use proper Docker host.`
      );
      // attach a helpful code for handlers
      err.code = "MONGO_CONNECT_TIMEOUT";
      reject(err);
    }, timeoutMs);

    mongoose.connection.once("connected", onReady);
    mongoose.connection.once("open", onReady);
  });
}

// Make sure every controller function calls await waitForMongooseReady() before DB ops.
// Example usage already present in this file (createSession, fetchAllSessions, etc.)

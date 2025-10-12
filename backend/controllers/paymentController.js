import { validationResult } from "express-validator";
import stripe from "../config/stripe.js";
import mongoose from "mongoose";
import Session from "../models/sessionModel.js";

export const webhookController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { userId, mentorId, sessionTime } = session.metadata;
      const parsedTime = JSON.parse(sessionTime);

      const alreadyExist = await Session.findOne({
        stripePayment: session.id,
      });
      if (alreadyExist) return res.json({ received: true });

      await Session.create({
        user: new mongoose.Types.ObjectId(userId),
        mentor: new mongoose.Types.ObjectId(mentorId),
        sessionTime: parsedTime,
        status: "upcoming",
        stripePayment: session.id,
        amountPaid: session.amount_total / 100,
      });

       console.log("✅ Session created for", userId);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  }
  res.json({ received: true });
};


//helper
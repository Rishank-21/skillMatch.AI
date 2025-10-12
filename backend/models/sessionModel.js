
import mongoose from "mongoose"

const sessionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true
  },
  sessionTime: [{
    date: { type: Date },
    time: { type: String }
  }],
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  },
  stripePayment: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number
  },
  isReminderSent: { 
    type: Boolean,
    default: false 
  },
  fifteenMinReminderSent: {
    type: Boolean,
    default: false
  },
  userJoinedAt: { type: Date },
  mentorJoinedAt: { type: Date }

}, {timestamps: true})

const Session = mongoose.model("Session", sessionSchema)
export default Session

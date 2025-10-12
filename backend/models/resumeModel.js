import mongoose from "mongoose";
//helper
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  extractedSkills: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resume", resumeSchema)
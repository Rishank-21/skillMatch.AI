import Mentor from "../models/mentorModel.js";
import { validationResult } from "express-validator";
import Auth from "../models/authModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const completeProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    let { skills, availableSlots, bio, fee } = req.body;
    const uploadedFile = req.file; // may contain .buffer when using memoryStorage
    let profileImage = null;

    if (!bio || !skills || !profileImage) {
      if (!uploadedFile) {
        return res
          .status(400)
          .json({ message: "Bio, skills and profile image are required" });
      }
    }

    // Upload profile image to Cloudinary
    try {
      const uploadedUrl = await uploadOnCloudinary(uploadedFile);
      if (!uploadedUrl)
        return res
          .status(500)
          .json({ message: "Failed to upload profile image" });
      profileImage = uploadedUrl;
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Image upload error", error: err.message });
    }

    const userId = req.user.id;

    // Parse skills
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Parse availableSlots
    if (typeof availableSlots === "string") {
      try {
        availableSlots = JSON.parse(availableSlots);
      } catch {
        availableSlots = [];
      }
    }

    // Convert string slots to objects
    if (Array.isArray(availableSlots)) {
      availableSlots = availableSlots.map((slot) => {
        if (typeof slot === "string") {
          const [date, time] = slot.split(" ");
          return { date, time };
        }
        return slot;
      });
    } else availableSlots = [];

    // Validate slots
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    for (let i = 0; i < availableSlots.length; i++) {
      const s = availableSlots[i];
      if (!s?.date || !s?.time)
        return res.status(400).json({ message: `Slot ${i} is invalid` });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || isNaN(Date.parse(s.date)))
        return res
          .status(400)
          .json({ message: `Slot ${i} date format must be YYYY-MM-DD` });
      if (!timeRegex.test(s.time))
        return res
          .status(400)
          .json({ message: `Slot ${i} time must be HH:mm` });
      availableSlots[i] = { date: new Date(s.date), time: s.time };
    }

    const existingMentor = await Auth.findById(userId);
    if (!existingMentor)
      return res.status(404).json({ message: "Mentor profile not found" });

    const mentor = await Mentor.create({
      user: existingMentor,
      skills,
      availableSlots,
      profileImage,
      bio,
      fee,
    });

    return res
      .status(201)
      .json({ message: "Mentor profile completed successfully", mentor });
  } catch (error) {
    console.error("Complete profile error:", error);
    return res.status(500).json({
      message: "Server Error during complete profile",
      error: error.message,
    });
  }
};

export const updateMentorData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    let { skills, availableSlots, bio, fee } = req.body;
    const uploadedFile = req.file; // may include .buffer
    let profileImageUrl;

    // If a new file is provided, upload to Cloudinary
    if (uploadedFile) {
      try {
        const uploadedUrl = await uploadOnCloudinary(uploadedFile);
        if (!uploadedUrl)
          return res
            .status(500)
            .json({ message: "Failed to upload profile image" });
        profileImageUrl = uploadedUrl;
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Image upload error", error: err.message });
      }
    }

    // Parse skills
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Parse slots
    if (typeof availableSlots === "string") {
      try {
        availableSlots = JSON.parse(availableSlots);
      } catch {
        availableSlots = [];
      }
    }

    if (Array.isArray(availableSlots)) {
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
      availableSlots = availableSlots.map((slot, i) => {
        const s =
          typeof slot === "string"
            ? { date: slot.split(" ")[0], time: slot.split(" ")[1] }
            : slot;
        if (
          !s?.date ||
          !s?.time ||
          !/^\d{4}-\d{2}-\d{2}$/.test(s.date) ||
          isNaN(Date.parse(s.date)) ||
          !timeRegex.test(s.time)
        ) {
          throw new Error(`Slot ${i} invalid`);
        }
        return { date: new Date(s.date), time: s.time };
      });
    } else availableSlots = [];

    // Build update object to avoid overwriting profileImage when not provided
    const updateData = { skills, availableSlots, bio, fee };
    if (profileImageUrl) updateData.profileImage = profileImageUrl;

    const mentor = await Mentor.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true }
    );

    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    return res
      .status(200)
      .json({ message: "Mentor data updated successfully", mentor });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during update mentor data",
      error: error.message,
    });
  }
};

// export const updateMentorData = async (req, res) => {
//   try {
//     const mentorId = req.user.id;
//     const updates = req.body;

//     const mentor = await Mentor.findById(mentorId);
//     if (!mentor) return res.status(404).json({ message: "Mentor not found" });

//     // Only update provided fields
//     Object.keys(updates).forEach((key) => {
//       if (updates[key] !== undefined && updates[key] !== null && updates[key] !== "") {
//         mentor[key] = updates[key];
//       }
//     });

//     await mentor.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       mentor,
//     });
//   } catch (error) {
//     console.error("❌ Error updating mentor profile:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

export const getMentor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const mentor = await Mentor.findOne({ user: req.user.id }).populate(
      "user",   
      "username email"
    );
    if (!mentor) {
      return res.status(404).json({ message: "mentor not found" });
    }
    
    res.status(200).json(mentor);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error during getting mentor data" });
  }
};

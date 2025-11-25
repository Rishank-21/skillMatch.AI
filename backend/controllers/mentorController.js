


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
    const uploadedFile = req.file;
    let profileImage = null;

    // Check for required fields
    if (!bio || !skills) {
      return res.status(400).json({ 
        message: "Bio and skills are required" 
      });
    }

    if (!uploadedFile) {
      return res.status(400).json({ 
        message: "Profile image is required" 
      });
    }

    // ✅ Upload profile image to Cloudinary
    try {
      const uploadResult = await uploadOnCloudinary(uploadedFile, {
        folder: "mentor_profiles" // Organize uploads in folder
      });
      
      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ 
          message: "Failed to upload profile image" 
        });
      }
      
      // ✅ FIX: Extract only the secure_url string, not the entire object
      profileImage = uploadResult.secure_url;
      
      
    } catch (err) {
      console.error("❌ Image upload error:", err);
      return res.status(500).json({ 
        message: "Image upload error", 
        error: err.message 
      });
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
    } else {
      availableSlots = [];
    }

    // Validate slots
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    for (let i = 0; i < availableSlots.length; i++) {
      const s = availableSlots[i];
      
      if (!s?.date || !s?.time) {
        return res.status(400).json({ message: `Slot ${i} is invalid` });
      }

      let dateString = s.date;

      // ✅ Handle ISO date format (2025-11-24T00:00:00.000Z)
      if (typeof dateString === 'string' && dateString.includes('T')) {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ 
            message: `Slot ${i} has invalid date value` 
          });
        }
        // Convert to YYYY-MM-DD format
        dateString = dateObj.toISOString().split('T')[0];
      }

      // ✅ Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) || isNaN(Date.parse(dateString))) {
        return res.status(400).json({ 
          message: `Slot ${i} date format must be YYYY-MM-DD` 
        });
      }

      // ✅ Validate time format
      if (!timeRegex.test(s.time)) {
        return res.status(400).json({ 
          message: `Slot ${i} time must be HH:mm` 
        });
      }

      availableSlots[i] = { date: new Date(dateString), time: s.time };
    }

    const existingMentor = await Auth.findById(userId);
    if (!existingMentor)
      return res.status(404).json({ message: "Mentor profile not found" });

    // ✅ Create mentor with profileImage as STRING
    const mentor = await Mentor.create({
      user: existingMentor,
      skills,
      availableSlots,
      profileImage, // ✅ Now it's just a string URL
      bio,
      fee,
    });

    

    return res.status(201).json({ 
      message: "Mentor profile completed successfully", 
      mentor 
    });
    
  } catch (error) {
    console.error("❌ Complete profile error:", error);
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
    const uploadedFile = req.file;
    let profileImageUrl;

    // ✅ Upload profile image if provided
    if (uploadedFile) {
      try {
        const uploadResult = await uploadOnCloudinary(uploadedFile, {
          folder: "mentor_profiles"
        });
        
        if (!uploadResult || !uploadResult.secure_url) {
          return res.status(500).json({ 
            message: "Failed to upload profile image" 
          });
        }
        
        // ✅ FIX: Extract only the secure_url string
        profileImageUrl = uploadResult.secure_url;
        
        
      } catch (err) {
        console.error("❌ Image upload error:", err);
        return res.status(500).json({
          message: "Image upload error",
          error: err.message,
        });
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

    // Parse availableSlots
    if (typeof availableSlots === "string") {
      try {
        availableSlots = JSON.parse(availableSlots);
      } catch (err) {
        return res.status(400).json({
          message: "Invalid availableSlots format (JSON parse failed)",
        });
      }
    }

    // Validate availableSlots
    if (Array.isArray(availableSlots)) {
      const parsed = [];
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

      for (const slot of availableSlots) {
        let dateString = slot.date;
        const timeString = slot.time;

        // ✅ Handle ISO date format (2025-11-24T00:00:00.000Z)
        if (dateString && dateString.includes('T')) {
          const dateObj = new Date(dateString);
          if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
              message: `Invalid date value: ${dateString}`,
            });
          }
          // Convert to YYYY-MM-DD format
          dateString = dateObj.toISOString().split('T')[0];
        }

        // ✅ Validate date format (YYYY-MM-DD)
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return res.status(400).json({
            message: `Invalid date format: ${dateString}. Expected YYYY-MM-DD`,
          });
        }

        // ✅ Validate time format (HH:mm)
        if (!timeString || !timeRegex.test(timeString)) {
          return res.status(400).json({
            message: `Invalid time format: ${timeString}. Expected HH:mm`,
          });
        }

        parsed.push({
          date: dateString,
          time: timeString,
        });
      }

      availableSlots = parsed;
    }

    // Build update object
    const updateData = {
      skills,
      availableSlots,
      bio,
      fee,
    };

    // ✅ Only add profileImage if it was uploaded
    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl; // ✅ Now it's a string URL
    }

    // Update mentor in DB
    const mentor = await Mentor.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true }
    );

    if (!mentor)
      return res.status(404).json({ message: "Mentor not found" });

    

    return res.status(200).json({
      message: "Mentor data updated successfully",
      mentor,
    });
    
  } catch (error) {
    console.error("❌ Update mentor error:", error);
    return res.status(500).json({
      message: "Server error during update mentor data",
      error: error.message,
    });
  }
};

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
      return res.status(404).json({ message: "Mentor not found" });
    }
    
    res.status(200).json(mentor);
  } catch (error) {
    console.error("❌ Get mentor error:", error);
    return res.status(500).json({ 
      message: "Error during getting mentor data",
      error: error.message 
    });
  }
};
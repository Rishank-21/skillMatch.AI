import { validationResult } from "express-validator";
import Resume from "../models/resumeModel.js";
import Mentor from "../models/mentorModel.js";
import Auth from "../models/authModel.js";

const matchScore = (userSkills, mentorSkills) => {
  if (!Array.isArray(userSkills) || !Array.isArray(mentorSkills)) return 0;
  const overlap = userSkills.filter((skill) =>
    mentorSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );
  return overlap.length; // Higher = better matchhelper
};

export const findMentor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await  Resume.findOne({ user: req.user.id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "please submit your resume before finding mentors" });
    }
    let userSkills = user.extractedSkills;

    if (!userSkills) {
      return res
        .status(400)
        .json({ message: "cannot find mentors to your skills" });
    }

    const mentors = await Mentor.find().populate("user", "username email");

    if (!mentors) return res.status(404).json({ message: "mentor not found" });
    const results = mentors.map((mentor) => {
      const score = matchScore(userSkills, mentor.skills);
      return {
        mentor,
        matchScore: score,
      };
    });
    results.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ mentors: results });
  } catch (error) {
    return res.status(500).json({ message: "error during mentor fetching" });
  }
};




export const searchMentors = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { searchTerm } = req.body;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ error: "Please enter a search term" });
    }

    // Case-insensitive regex
    const regex = new RegExp(searchTerm, "i");

    // Find mentors and populate user details (username)
    const mentors = await Mentor.find({
      $or: [
        { skills: { $in: [regex] } }, // match skills
      ]
    }).populate("user", "username email"); // populate name from User

    // Additionally filter by username (user field)
    const filtered = mentors.filter(
      (mentor) => regex.test(mentor.user?.username)
        || mentor.skills.some(skill => regex.test(skill))
    );

    if (!filtered.length) {
      return res.status(404).json({ message: "No mentors found" });
    }

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Error during mentor search" });
  }
};

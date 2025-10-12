import fs from "fs";
import pdfParse from "pdf-parse";
import extractSkills from "../config/extractSkills.js";
import Resume from "../models/resumeModel.js";
import dotenv from "dotenv";
import uploadOnCloudinary from "../config/cloudinary.js";
dotenv.config();


export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ error: "No text extracted from PDF" });
    }

    const skills = await extractSkills(extractedText);
    

    // upload file to Cloudinary (PDF) helper
    let cloudinaryUrl = null;
    try {
      cloudinaryUrl = await uploadOnCloudinary(req.file.path);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      cloudinaryUrl = null;
    }

    const resumeDoc = new Resume({
      user: req.user.id,
      originalText: extractedText,
      extractedSkills: skills,
      cloudinaryUrl, // store uploaded file URL
    });

    await resumeDoc.save();

    res.status(200).json({
      message: "Resume parsed and skills extracted successfully",
      extractedSkills: skills,
      fallbackText: extractedText,
      cloudinaryUrl,
    });
  } catch (error) {
    console.error("Parse error:", error.message);
    res.status(500).json({
      error: "Gemini API failed",
      fallbackText: req.file ? fs.readFileSync(req.file.path, "utf-8") : "",
    });
  }
};

export const saveParsedResume = async (req, res) => {
  try {
    // Accept both the original and fallback field names
    const parsed = req.body.parsed || req.body.fallbackText;
    const raw = req.body.raw || req.body.fallbackText;

    if (!parsed || !raw) {
      return res
        .status(400)
        .json({ error: "Parsed data or raw text is missing" });
    }

    const skills = req.body.extractedSkills || (await extractSkills(parsed));

    // if a file is provided during save, upload it too
    let cloudinaryUrl = req.body.cloudinaryUrl || null;
    if (req.file) {
      try {
        cloudinaryUrl = await uploadOnCloudinary(req.file.path);
      } catch (err) {
        console.error("Cloudinary upload failed during save:", err);
      }
    }

    const resumeDoc = new Resume({
      user: req.user.id,
      rawText: raw,
      parsedText: parsed,
      extractedSkills: skills,
      originalText: raw, // <-- Add this line to satisfy the schema
      cloudinaryUrl,
    });

    await resumeDoc.save();
    res.status(200).json({ message: "Resume saved successfully", skills, cloudinaryUrl });
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({ error: "Failed to save parsed resume" });
  }
};


export const userResumeController  = async (req , res) => {
    try {
    const userId = req.user.id;
    const resume = await Resume.findOne({ user: userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
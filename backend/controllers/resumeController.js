
// controllers/resumeController.js - FIXED FOR RENDER DEPLOYMENT
import fs from "fs";
import extractSkills from "../config/extractSkills.js";
import Resume from "../models/resumeModel.js";
import dotenv from "dotenv";
import uploadOnCloudinary from "../config/cloudinary.js";

// ✅ FIX: Use pdf.js-extract instead of pdf-parse (no test file dependency)
import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

dotenv.config();

// Helper function to extract text from PDF buffer
async function extractTextFromPDF(buffer) {
  try {
    const options = {};
    const data = await pdfExtract.extractBuffer(buffer, options);
    
    // Combine all text from all pages
    let fullText = '';
    data.pages.forEach(page => {
      page.content.forEach(item => {
        if (item.str) {
          fullText += item.str + ' ';
        }
      });
      fullText += '\n'; // Add newline between pages
    });
    
    return fullText.trim();
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
}

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get file buffer
    let fileBuffer;
    if (req.file.buffer) {
      fileBuffer = req.file.buffer;
    } else if (req.file.path) {
      fileBuffer = await fs.promises.readFile(req.file.path);
    } else {
      return res.status(400).json({ error: "Uploaded file missing buffer/path" });
    }

    // ✅ Extract text using pdf.js-extract (no test file issues)
   
    const extractedText = await extractTextFromPDF(fileBuffer);

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({ 
        error: "No text extracted from PDF. Please ensure the PDF contains readable text." 
      });
    }

    

    // Extract skills using Gemini
    const skills = await extractSkills(extractedText);

    // Upload to Cloudinary
    let cloudinaryUrl = null;
    try {
      if (req.file.buffer) {
        const uploadResult = await uploadOnCloudinary({ 
          buffer: req.file.buffer, 
          originalname: req.file.originalname 
        });
        cloudinaryUrl = uploadResult?.secure_url || null;
      } else if (req.file.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        cloudinaryUrl = uploadResult?.secure_url || null;
      }
      
      if (cloudinaryUrl) {
        console.log("✅ Uploaded to Cloudinary");
      }
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err?.message || err);
      // Don't fail the entire request
    }

    // Save to database
    const resumeDoc = new Resume({
      user: req.user?.id,
      originalText: extractedText,
      extractedSkills: skills,
      cloudinaryUrl,
    });

    await resumeDoc.save();
    

    // ✅ FIXED: Now returning originalText in response
    return res.status(200).json({
      message: "Resume parsed and skills extracted successfully",
      originalText: extractedText,  // ⬅️ ADDED THIS LINE!
      extractedSkills: skills,
      skillCount: skills.length,
      textLength: extractedText.length,
      cloudinaryUrl,
    });

  } catch (error) {
    console.error("❌ parseResume error:", error?.stack || error?.message || error);
    return res.status(500).json({
      error: "Resume parse/upload failed",
      details: error?.message || "internal error",
    });
  } finally {
    // Clean up disk storage file if exists
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkErr) {
        // File might already be deleted, ignore
      }
    }
  }
};

export const saveParsedResume = async (req, res) => {
  try {
   

    // Get text content from various possible sources
    const textContent = req.body.originalText || 
                       req.body.parsed || 
                       req.body.fallbackText || 
                       req.body.raw ||
                       req.body.text;

    if (!textContent || textContent.trim().length < 10) {
      console.error("❌ Missing or invalid text content");
      return res.status(400).json({ 
        error: "Resume text is missing or too short",
        received: Object.keys(req.body)
      });
    }

    // Get skills - either from body or extract them
    let skills = req.body.extractedSkills || req.body.skills;
    
    // If skills is a string (comma-separated), convert to array
    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    // Ensure skills is an array
    if (!Array.isArray(skills)) {
      skills = [];
    }
    
    // If no skills provided, extract them
    if (skills.length === 0) {
      
      try {
        skills = await extractSkills(textContent);
      } catch (extractError) {
        console.error("❌ Skill extraction failed:", extractError.message);
        // Continue with empty skills array rather than failing
        skills = [];
      }
    }

    // Get or upload cloudinary URL
    let cloudinaryUrl = req.body.cloudinaryUrl || null;
    
    if (req.file) {
      try {
        if (req.file.buffer) {
          const uploadResult = await uploadOnCloudinary({ 
            buffer: req.file.buffer, 
            originalname: req.file.originalname 
          });
          cloudinaryUrl = uploadResult?.secure_url || cloudinaryUrl;
        } else if (req.file.path) {
          const uploadResult = await uploadOnCloudinary(req.file.path);
          cloudinaryUrl = uploadResult?.secure_url || cloudinaryUrl;
        }
        
      } catch (err) {
        console.error("❌ Cloudinary upload failed during save:", err?.message || err);
      }
    }

    // Check if resume already exists for this user
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: "User not authenticated" 
      });
    }

    let resumeDoc = await Resume.findOne({ user: userId });

    if (resumeDoc) {
      // Update existing resume
      
      resumeDoc.originalText = textContent;
      resumeDoc.extractedSkills = skills;
      
      // Only update cloudinaryUrl if a new one is provided
      if (cloudinaryUrl) {
        resumeDoc.cloudinaryUrl = cloudinaryUrl;
      }
      
      await resumeDoc.save();
      
    } else {
      // Create new resume
      
      resumeDoc = new Resume({
        user: userId,
        originalText: textContent,
        extractedSkills: skills,
        cloudinaryUrl: cloudinaryUrl,
      });
      await resumeDoc.save();
      
    }
    
    res.status(200).json({ 
      message: "Resume saved successfully", 
      extractedSkills: skills,
      skillCount: skills.length,
      cloudinaryUrl: resumeDoc.cloudinaryUrl,
      resumeId: resumeDoc._id,
      originalText: resumeDoc.originalText
    });
  } catch (error) {
    console.error("❌ saveParsedResume error:", error?.stack || error?.message || error);
    res.status(500).json({ 
      error: "Failed to save parsed resume",
      details: error?.message 
    });
  } finally {
    // Clean up disk storage file if exists
    if (req.file?.path) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkErr) {
        // File might already be deleted, ignore
      }
    }
  }
};

export const userResumeController = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    console.error("❌ userResumeController error:", err?.message || err);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};
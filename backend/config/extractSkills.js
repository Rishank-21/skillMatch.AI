
// config/extractSkills.js - AUTO-DETECT AVAILABLE MODELS
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Cache available models to avoid repeated API calls
let availableModels = null;
let modelsFetched = false;

const knownSkills = [
  "JavaScript", "Python", "React", "Node.js", "MongoDB",
  "Express", "Java", "C++", "Machine Learning", "AI",
  "HTML", "CSS", "Django", "Flask", "SQL", "AWS",
  "Docker", "Kubernetes", "TypeScript", "Next.js", "Tailwind", "Git", "GitHub",
  "REST", "Firebase", "JWT", "PostgreSQL", "Redis", "GraphQL", "Angular", "Vue",
  "Spring Boot", "Laravel", "Ruby on Rails", "PHP", "Go", "Rust", "Swift"
];

// Fetch available models from Gemini API
async function getAvailableModels() {
  if (modelsFetched && availableModels) {
    return availableModels;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    
    const models = response.data.models
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .map(m => m.name.split("/")[1]); // Extract model name like "gemini-2.5-flash"

    availableModels = models;
    modelsFetched = true;

    console.log("✅ Available models:", models.slice(0, 5));
    return models;
  } catch (err) {
    console.error("❌ Failed to fetch available models:", err.message);
    // Fallback to common models
    return ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.5-flash-lite"];
  }
}

// Select best models for skill extraction
async function selectModels() {
  const models = await getAvailableModels();
  
  // Preferred order: Flash-Lite > Flash > Pro
  const preferences = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash",
    "gemini-2.5-pro",
    "gemini-pro"
  ];

  const selected = [];
  for (const pref of preferences) {
    const found = models.find(m => m.includes(pref));
    if (found && !selected.includes(found)) {
      selected.push(found);
    }
  }

  // If nothing found, use first available model
  if (selected.length === 0 && models.length > 0) {
    selected.push(models[0]);
  }

  return selected.slice(0, 2); // Return top 2 models
}

async function callGeminiModel(model, prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 800,
      topP: 1,
      topK: 1
    }
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000
    });
    return resp.data;
  } catch (err) {
    throw err;
  }
}

function extractTextFromResponse(data) {
  try {
    if (!data?.candidates?.[0]) {
      console.error("❌ No candidates in response");
      return null;
    }
    
    const candidate = data.candidates[0];
    
    // Check for blocking
    if (candidate.finishReason === "SAFETY" || candidate.finishReason === "RECITATION") {
      console.error("🚫 Response blocked:", candidate.finishReason);
      return null;
    }
    
    const text = candidate?.content?.parts?.[0]?.text || "";
    
    if (text && text.trim()) {
      console.log(`✅ Got ${text.length} chars from Gemini`);
      return text.trim();
    }
    
    console.error("⚠️ Empty text in response");
    return null;
  } catch (err) {
    console.error("❌ Error extracting text:", err.message);
    return null;
  }
}

export const extractSkills = async (text) => {
  // Ultra-simple prompt
  const prompt = `List technical skills from this resume as comma-separated values:

${text.substring(0, 3000)}

Skills:`;

  try {
    // Get available models
    const [primaryModel, fallbackModel] = await selectModels();

    if (!primaryModel) {
      throw new Error("No models available");
    }

    console.log(`🔍 Selected models: ${primaryModel}, ${fallbackModel || "none"}`);

    let data;
    let modelUsed = primaryModel;

    // Try primary model
    try {
      console.log(`🔍 Calling ${primaryModel}...`);
      data = await callGeminiModel(primaryModel, prompt);
    } catch (e) {
      console.warn(`⚠️ ${primaryModel} failed:`, e?.response?.data?.error?.message || e.message);
      
      // Try fallback if available
      if (fallbackModel) {
        console.log(`🔍 Trying ${fallbackModel}...`);
        modelUsed = fallbackModel;
        data = await callGeminiModel(fallbackModel, prompt);
      } else {
        throw e;
      }
    }

    const raw = extractTextFromResponse(data);
    
    if (!raw) {
      throw new Error("No text in response");
    }

    // Parse skills
    const skills = raw
      .replace(/\n/g, ",")
      .replace(/;/g, ",")
      .split(",")
      .map(s => s.trim().replace(/^[-•\d\.\)]+\s*/, ""))
      .filter(s => s.length > 1 && s.length < 40)
      .filter((s, i, arr) => arr.findIndex(x => x.toLowerCase() === s.toLowerCase()) === i);

    if (skills.length > 0) {
      console.log(`✅ Extracted ${skills.length} skills using ${modelUsed}`);
      return skills;
    }
    
    throw new Error("No skills parsed");

  } catch (err) {
    console.warn("⚠️ Gemini failed, using keyword fallback");
    console.error("Details:", err?.response?.data?.error || err.message);
    
    // Keyword matching fallback
    const lower = text.toLowerCase();
    const matched = knownSkills.filter(s => lower.includes(s.toLowerCase()));
    
    console.log(`✅ Found ${matched.length} skills via keywords`);
    return matched.length > 0 ? matched : ["No skills detected"];
  }
};

export default extractSkills;
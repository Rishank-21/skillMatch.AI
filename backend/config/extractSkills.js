

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIMARY_MODEL = "gemini-1.5-pro";     // try pro first
const FALLBACK_MODEL = "gemini-1.5-flash";  // fallback if pro fails helper

const knownSkills = [
  "JavaScript", "Python", "React", "Node.js", "MongoDB",
  "Express", "Java", "C++", "Machine Learning", "AI",
  "HTML", "CSS", "Django", "Flask", "SQL", "AWS",
  "Docker", "Kubernetes", "TypeScript", "Next.js","Tailwind","Git","Github",
  "Rest APIs","Firebase","JWT"
];

async function callGemini(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY, 
      },
    }
  );

  return response;
}

export const extractSkills = async (text) => {
  try {
    const prompt = `Extract only technical skills from this resume:\n\n${text}\n\nRespond with a comma-separated list only.`;

    let response;
    try {
      // Try pro model first
      response = await callGemini(PRIMARY_MODEL, prompt);
    } catch (err) {
      console.warn("Gemini Pro failed:", err.response?.data || err.message);
      console.warn("Falling back to Flash...");
      // If Pro fails, try Flash
      response = await callGemini(FALLBACK_MODEL, prompt);
    }

    const result =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const skills = result
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return skills;
  } catch (error) {
    console.error(
      "Gemini API final failure:",
      error.response?.status,
      JSON.stringify(error.response?.data, null, 2) || error.message
    );

    // --- Fallback if Gemini completely fails ---
    const lowerText = text.toLowerCase();
    return knownSkills.filter((skill) =>
      lowerText.includes(skill.toLowerCase())
    );
  }
};

export default extractSkills;

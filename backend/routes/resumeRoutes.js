import express from "express";
import multer from "multer";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Use dynamic imports so missing files don't crash the whole app at startup
router.post(
  "/parse",
  isAuth,
  upload.single("resume"),
  async (req, res, next) => {
    try {
      const mod = await import("../controllers/ResumeController.js");
      return mod.parseResume(req, res, next);
    } catch (err) {
      console.error("Failed to load ResumeController for /parse:", err);
      return res
        .status(500)
        .json({ error: "Server configuration error - controller missing" });
    }
  }
);

router.post("/save", isAuth, async (req, res, next) => {
  try {
    const mod = await import("../controllers/ResumeController.js");
    return mod.saveParsedResume(req, res, next);
  } catch (err) {
    console.error("Failed to load ResumeController for /save:", err);
    return res
      .status(500)
      .json({ error: "Server configuration error - controller missing" });
  }
});

router.get("/me", isAuth, async (req, res, next) => {
  try {
    const mod = await import("../controllers/ResumeController.js");
    return mod.userResumeController(req, res, next);
  } catch (err) {
    console.error("Failed to load ResumeController for /me:", err);
    return res
      .status(500)
      .json({ error: "Server configuration error - controller missing" });
  }
});

export default router;

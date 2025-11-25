

import express from "express";
import multer from "multer";
import { parseResume, saveParsedResume, userResumeController } from "../controllers/resumeController.js";
import { isAuth } from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });hleper
router.post("/parse", isAuth, upload.single("resume"), parseResume);
router.post("/save", isAuth, saveParsedResume);

router.get('/me', isAuth, userResumeController)

export default router;

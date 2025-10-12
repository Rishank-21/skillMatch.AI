import express from "express"
const router = express.Router()
import { findMentor, searchMentors } from "../controllers/getmentorController.js"
import { isAuth } from "../middlewares/isAuth.js"
//helper
router.get("/skills/mentor" , isAuth, findMentor)
router.post("/search", isAuth, searchMentors)

export default router
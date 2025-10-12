import express from 'express'
const router = express.Router()
import { isAuth } from "../middlewares/isAuth.js";
import { createSession, fetchAllMentorSessions, fetchAllSessions, fetchSessionDetails, joinSession } from '../controllers/sessionController.js';
import stripe from '../config/stripe.js';
import { sendMail } from '../config/mail.js';
//helper

router.post('/create-session'  , createSession)
router.post('/verify-payment', fetchSessionDetails)
router.get('/all',isAuth,  fetchAllSessions)
router.post('/send-mail', isAuth, sendMail)
router.post('/join', joinSession)
router.get('/mentor-session', isAuth, fetchAllMentorSessions)

export default router
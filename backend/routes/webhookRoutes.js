import express from "express"
import stripe from "../config/stripe.js"
import mongoose from "mongoose"
import Session from "../models/sessionModel.js"
import { isAuth } from "../middlewares/isAuth.js"
import { webhookController } from "../controllers/paymentController.js"
const router = express.Router()
//helper
router.post('/', webhookController)

export default router
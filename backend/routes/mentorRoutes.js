import express from 'express';
const router = express.Router();    
import { body } from 'express-validator';
import { completeProfile, getMentor, updateMentorData } from '../controllers/mentorController.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
import { feedBackMail } from '../config/mail.js';
//helper
router.use(isAuth);

router.post('/complete-profile',upload.single("profileImage"), [
    body('skills').notEmpty().withMessage('Skills are required'),
    body('bio').notEmpty().withMessage('Bio is required')
], completeProfile);

router.put('/update-mentor-data',upload.single("profileImage"), updateMentorData);

router.get("/mentorData" , getMentor)

router.post('/send-feedback', feedBackMail)

export default router;
import express from 'express';
import { logout, login, register , getProfile, googleAuth } from '../controllers/authController.js';
import { body } from 'express-validator';
import { isAuth } from '../middlewares/isAuth.js';

//helper
const router = express.Router();

router.post('/register' , [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min : 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['user' , 'mentor']).withMessage('Role must be either user or mentor')
] , register);

router.post('/login' , [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').not().isEmpty().withMessage('Password is required')
] , login);

router.post('/logout' , logout);

router.get('/profile', isAuth , getProfile);

router.post('/google', googleAuth)


export default router
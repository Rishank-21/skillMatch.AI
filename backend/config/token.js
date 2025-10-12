import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
//helper

export const createToken = (userId) => {
    return jwt.sign(
        { id : userId },
        process.env.JWT_SECRET,
        { expiresIn : '7d' }
    );
}

import express from 'express';
import Auth from '../models/authModel.js';
import { validationResult } from 'express-validator';
import { createToken } from '../config/token.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }
    try {
        const { username , email , password , role } = req.body;
        const isExist = await Auth.findOne({ email });
        if(isExist){
            return res.status(400).json({ error : 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const user = await Auth.create({ username , email , password : hashedPassword , role });
        const token = createToken(user._id);
        res.cookie('token' , token , {
            httpOnly : true,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days helper
        });
        return res.status(201).json({ user , token});
    } catch (error) {
        return res.status(500).json({ error : 'Internal Server Error' });
    }
}


export const login = async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }

    try {
        const { email , password } = req.body;
        const user = await Auth.findOne({ email }).select('+password');
        if(!user){
            return res.status(400).json({ error : 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({ error : 'Invalid credentials' });
        }
        const token = createToken(user._id);
        res.cookie('token' , token , {
            httpOnly : true,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({ user , token });
    } catch (error) {
        return res.status(500).json({ error : 'Internal Server Error' });
    }
}





export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
      sameSite: "strict", 
      path: "/", // make sure path matches the cookie path
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Failed to logout, try again" });
  }
};


export const getProfile = async (req , res) => {
    try {
        const user = await Auth.findById(req.user.id).select('-password');
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error : 'Internal Server Error' });
    }
}

export const googleAuth = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    let user = await Auth.findOne({ email });
    if (!user) {
      user = await Auth.create({
        username,
        email,
        role
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({ token , user})
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
};

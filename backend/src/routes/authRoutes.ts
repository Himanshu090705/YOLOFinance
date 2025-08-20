import express from "express";
import userRoutes from "./userRoutes";
import { generateOTP, verifyOTP, resetPassword } from "../controllers/authController";
const authRoutes = express.Router();

authRoutes.post('/otp', generateOTP);
authRoutes.post('/verify-otp', verifyOTP);
authRoutes.post('/reset-password', resetPassword)
export default authRoutes;

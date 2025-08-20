import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import { generateOTP, verifyOTP } from "../controllers/authController";
const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
export default routes;

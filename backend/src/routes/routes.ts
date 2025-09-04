import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import { generateOTP, verifyOTP } from "../controllers/authController";
import investmentRoutes from "./investmentsRoutes";
const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use('/investments', investmentRoutes);
export default routes;

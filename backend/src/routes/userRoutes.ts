import express from "express";
import {
  login,
  signup,
  googleOAuthCallback,
  googleOAuth,
} from "../controllers/userController";
const userRoutes = express.Router();

userRoutes.post("/login", login);
userRoutes.post("/signup", signup);
userRoutes.get("/auth/google", googleOAuth);
userRoutes.get("/google-oauth-callback", googleOAuthCallback);

export default userRoutes;

import express from "express";
import {
  login,
  signup,
  googleOAuthCallback,
  googleOAuth,
  userLogout,
} from "../controllers/userController";
import { verifyJWT } from "../middleware/auth.middleware";
const userRoutes = express.Router();

userRoutes.post("/login", verifyJWT, login);
userRoutes.post("/signup", signup);
userRoutes.get("/auth/google", googleOAuth);
userRoutes.get("/google-oauth-callback", googleOAuthCallback);
userRoutes.get('/logout', userLogout);

export default userRoutes;

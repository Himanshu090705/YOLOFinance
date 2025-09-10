import express from "express";
import { getMFs, mfBuyController, cancelMF } from "../controllers/investmentController";
import { verifyJWT } from "../middleware/auth.middleware";

const investmentRoutes = express.Router();

investmentRoutes.post("/mf-buy", verifyJWT, mfBuyController as any);
investmentRoutes.get("/mf-get", verifyJWT, getMFs as any);
investmentRoutes.post("/mf-cancel", verifyJWT, cancelMF as any); // 🚀 new route

export default investmentRoutes;

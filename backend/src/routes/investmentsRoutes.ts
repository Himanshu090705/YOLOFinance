import express from "express";
import { getMFs, mfBuyController } from "../controllers/investmentController";
import { verifyJWT } from "../middleware/auth.middleware";

const investmentRoutes = express.Router();

investmentRoutes.post( "/mf-buy",verifyJWT, mfBuyController as any);
investmentRoutes.get("/mf-get", verifyJWT, getMFs as any);
export default investmentRoutes;

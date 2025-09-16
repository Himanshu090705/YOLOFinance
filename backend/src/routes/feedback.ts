import express from "express";
import { handleFeedback } from "../controllers/feedbackController";

const router = express.Router();

router.post("/feedback", handleFeedback);

export default router;

import express, { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { BuyInsurance, cancelPolicy, fetchInsurance } from "../controllers/insuranceController";

const InsuranceRoutes = Router();
InsuranceRoutes.post('/buy-policy', verifyJWT, BuyInsurance as any);
InsuranceRoutes.get('/fetchInsurance', verifyJWT, fetchInsurance as any);
InsuranceRoutes.post('/cancel', verifyJWT, cancelPolicy as any)
export default InsuranceRoutes;
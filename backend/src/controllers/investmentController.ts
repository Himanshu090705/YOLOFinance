import mongoose from "mongoose";
import { Request, Response } from "express";
import UserInvestments from "../model/userInvestment";
import { AuthRequest } from "../definitions/AuthRequest";
import Stripe from "stripe";
export async function mfBuyController(req: AuthRequest, res: Response) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    try {
        const {
            schemeCode,
            schemeName,
            frequency,
            date,
            amount,
            nav,
            units,
            nextDate,
        } = req.body;

        const user = req.user._id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: schemeName,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: process.env.ORIGIN + "/Dashboard",
            cancel_url: "http://localhost:5173/cancel",
        });
        if (session) {
            const newInvestment = new UserInvestments({
                userId: user,
                schemeCode,
                schemeName,
                frequency,
                date,
                amount,
                nav,
                units,
                nextDate,
            });
            const response = await newInvestment.save();
            if (response) {
                res.status(201).send({
                    message: "New Investment Made Successfully",
                    url: session.url,
                    id: session.id,
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getMFs(req: AuthRequest, res: Response) {
    try {
        const user = req.user._id;
        const investments = await UserInvestments.aggregate([
            {
                $match: { userId: user, isCancelled: false }, // ✅ skip cancelled SIPs
            },
            {
                $group: {
                    _id: "$schemeCode",
                    schemeName: { $first: "$schemeName" },
                    schemeCode: { $first: "$schemeCode" },
                    amount: { $first: "$amount" },
                    nav: { $first: "$nav" },
                    units: { $first: "$units" },
                },
            },
        ]);

        res.status(200).send({ investments });
    } catch (error) {
        console.error("Get MFs error:", error);
        res.status(500).send({ message: "Failed to fetch investments" });
    }
}

export async function cancelMF(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?._id;
        const { schemeCode } = req.body;

        if (!schemeCode) {
            return res
                .status(400)
                .json({ success: false, message: "Missing schemeCode" });
        }

        const investment = await UserInvestments.findOne({
            schemeCode,
            userId,
        });

        if (!investment) {
            return res
                .status(404)
                .json({ success: false, message: "Investment not found" });
        }

        investment.isCancelled = true;
        await investment.save();

        return res.json({
            success: true,
            message: "SIP cancelled successfully",
        });
    } catch (error: any) {
        console.error("❌ Cancel SIP error:", error.message, error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
}

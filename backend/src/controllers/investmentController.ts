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
        $match: { userId: user },
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

    if (investments) {
      res.status(200).send({ investments });
    }
  } catch (error) {}
}

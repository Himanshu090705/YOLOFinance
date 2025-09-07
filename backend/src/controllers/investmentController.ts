import { Request, Response } from "express";
import UserInvestments from "../model/userInvestment";
import { AuthRequest } from "../definitions/AuthRequest";
export async function mfBuyController(req: AuthRequest, res: Response) {
  try {
    const { schemeCode, schemeName, frequency, date, amount, nav, units, nextDate } =
      req.body;

    const user = req.user._id;
    const newInvestment = new UserInvestments({
      userId: user,
      schemeCode,
      schemeName,
      frequency,
      date,
      amount,
      nav,
      units,
      nextDate
    });
    const response = await newInvestment.save();

    if (response) {
      res.status(201).send({ message: "New Investment Made Successfully" });
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

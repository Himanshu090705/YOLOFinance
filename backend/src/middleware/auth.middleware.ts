import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
export async function verifyJWT(req: Request, res: Response, next: any) {
   try {
    const token = req.cookies?.access_token;
    if (!token) {
      res.status(401).json({ message: "No token, unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET as string) as { _id: string };

    const user = await User.findById(decoded._id).select("-password")
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    (req as any).user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
}

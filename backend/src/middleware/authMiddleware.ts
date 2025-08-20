import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
export async function verifyJWT(req: Request, res: Response, next: any) {
    try {
        const token = await req.cookies?.access_token;

        const decodedToken = jwt.verify(token, process.env.CLIENT_SECRET as string);
        console.log(decodedToken);
        next();
    } catch (error) {
        
    }
}   
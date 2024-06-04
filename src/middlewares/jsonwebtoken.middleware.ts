import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserAccountProps } from "../models/useraccount.model";
import { HttpStatus } from "../utils/httpstatus";

declare global {
    namespace Express {
        interface Request {
            email?: string;
        }
    }
}

const JsonWebToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.send(HttpStatus.UNAUTHORIZED);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    });
};

export default JsonWebToken;
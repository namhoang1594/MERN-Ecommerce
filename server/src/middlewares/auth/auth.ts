import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../helpers/jwt";
import { AuthPayload } from "../../types/auth-payload.types";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const decoded = verifyToken(token) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

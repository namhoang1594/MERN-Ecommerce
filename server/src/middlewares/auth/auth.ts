import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "../../services/auth/token.service";
import { UserRole } from "../../types/user.types";

/**
 * Middleware: verify access token
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token) as JwtPayload;

        // Tìm user trong DB để chắc chắn user vẫn tồn tại
        const user = await UserModel.findById(decoded.userId).select("_id role isActive");
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "User not found or inactive" });
        }

        req.user = {
            _id: user._id.toString(),
            role: user.role,
        };

        next();
    } catch (error: any) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

/**
 * Middleware: check role (admin)
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Access denied: Admin Only" });
    }
    next();
}


import { Request, Response } from "express";
import { changePasswordService, getProfileService, updateProfileService } from "../../services/shop/user-profile.service";


// GET /api/users/me
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await getProfileService(userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err });
    }
};

// PUT /api/users/me
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { name, phone, avatar } = req.body;

        const user = await updateProfileService(userId, { name, phone, avatar });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err });
    }
};

// PUT /api/users/change-password
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { oldPassword, newPassword } = req.body;

        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        await changePasswordService(userId, oldPassword, newPassword);
        res.json({ message: "Password changed successfully" });
    } catch (err: any) {
        res
            .status(400)
            .json({ message: err.message || "Error changing password", error: err });
    }
};

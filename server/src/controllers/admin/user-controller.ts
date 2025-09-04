import mongoose from "mongoose";
import { Request, Response } from "express";
import { deleteUserService, getAllUsersService, updateUserRoleService, updateUserStatusService } from "../../services/admin/user.service";
import { UserRole } from "../../types/user.types";


// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;
        const result = await getAllUsersService(
            String(search),
            Number(page),
            Number(limit)
        );
        res.json({
            success: true,
            message: "Users fetched successfully",
            data: result.users,
            pagination: result.pagination
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (req.user?._id === id && role !== UserRole.ADMIN) {
            return res.status(400).json({
                success: false,
                message: "Cannot demote yourself from admin role"
            });
        }

        if (req.user?._id === id) {
            return res.status(400).json({ message: "Cannot delete yourself" });
        }

        // Validate role
        if (!Object.values(UserRole).includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Validate ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await updateUserRoleService(id, role);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating role", error: err });
    }
};

// PUT /api/admin/users/:id/status
export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const user = await updateUserStatusService(id, isActive);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error updating status", error: err });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await deleteUserService(id);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err });
    }
};

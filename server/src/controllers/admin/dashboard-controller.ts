import { Request, Response } from "express";
import { getDashboardStatsService } from "../../services/admin/dashboard.service";


export const getDashboardStatsController = async (req: Request, res: Response) => {
    console.log("📢 Controller: getDashboardStats called");
    try {
        const stats = await getDashboardStatsService();
        res.status(200).json({
            stats
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard stats", error
        });
    }
};
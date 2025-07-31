import axiosInstance from "@/lib/axios";
import { DashboardStatsResponse } from "@/types/admin/dashboard/dashboard.types";

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    const res = await axiosInstance.get("/admin/dashboard");
    return res.data.stats;
};
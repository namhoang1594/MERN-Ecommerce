export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface OrderStatusData {
    name: string;
    value: number;
}

export interface TopProduct {
    _id: string;
    title: string;
    image: string;
    totalSold: number;
}

export interface RecentOrder {
    _id: string;
    user: {
        name: string;
    };
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    orderDate: string;

}

export interface DashboardStatsResponse {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    monthlyRevenue: MonthlyRevenue[];
    orderStatusStats: OrderStatusData[];
    topProducts: TopProduct[];
    recentOrders: RecentOrder[];
}

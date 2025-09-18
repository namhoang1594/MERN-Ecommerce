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
    finalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;

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
    loadingRecentOrders: boolean;
}

// export interface RecentOrder {
//     _id: string;
//     userName: string;
//     totalAmount: number;
//     finalAmount: number;
//     orderStatus: string;
//     paymentStatus: string;
//     orderDate: string;
// }


export interface DashboardState {
    recentOrders: RecentOrder[];
    loadingRecentOrders: boolean;
}
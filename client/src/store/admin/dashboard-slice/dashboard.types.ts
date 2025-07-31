export interface RecentOrder {
    _id: string;
    userName: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    orderDate: string;
}

export interface DashboardState {
    recentOrders: RecentOrder[];
    loadingRecentOrders: boolean;
}
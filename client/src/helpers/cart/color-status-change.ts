// Đồng bộ với enum OrderStatus ở BE
export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    AWAITING_PAYMENT = "awaiting_payment",
    PAID = "paid",
    SHIPPING = "shipping",
    // COMPLETED = "completed",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
}

export const getOrderStatusLabel = (status: string): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return "Chờ xử lý";
        case OrderStatus.PROCESSING:
            return "Đang xử lý";
        case OrderStatus.AWAITING_PAYMENT:
            return "Chờ thanh toán";
        case OrderStatus.PAID:
            return "Đã thanh toán";
        case OrderStatus.SHIPPING:
            return "Đang giao hàng";
        case OrderStatus.DELIVERED:
            return "Đã giao hàng";
        // case OrderStatus.COMPLETED:
        //     return "Đã hoàn thành";
        case OrderStatus.CANCELLED:
            return "Đã hủy";
        case OrderStatus.REFUNDED:
            return "Đã hoàn tiền";
        default:
            return status;
    }
};

export const getOrderStatusColor = (status: string): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return "text-yellow-600 bg-yellow-100";
        case OrderStatus.PROCESSING:
            return "text-blue-600 bg-blue-100";
        case OrderStatus.AWAITING_PAYMENT:
            return "text-orange-600 bg-orange-100";
        case OrderStatus.PAID:
            return "text-green-600 bg-green-100";
        case OrderStatus.SHIPPING:
            return "text-purple-600 bg-purple-100";
        case OrderStatus.DELIVERED:
            return "text-green-800 bg-green-200";
        // case OrderStatus.COMPLETED:
        //     return "text-green-800 bg-green-800";
        case OrderStatus.CANCELLED:
            return "text-red-600 bg-red-100";
        case OrderStatus.REFUNDED:
            return "text-gray-700 bg-gray-200";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

import OrderModel from "../../models/orders.model";
import { IOrder, OrderStatus } from "../../types/orders.types";

// Admin: lấy tất cả đơn hàng
export const getAllOrdersAdmin = async (): Promise<IOrder[]> => {
    return await OrderModel.find().populate("userId", "name email").sort({ createdAt: -1 });
}

export const getOrderByIdAdmin = async (orderId: string): Promise<IOrder | null> => {
    return await OrderModel.findById(orderId).populate("userId", "name email");
}

// Admin: cập nhật trạng thái đơn hàng
export const updateOrderStatusAdmin = async (orderId: string, status: OrderStatus): Promise<IOrder | null> => {
    return await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    ).populate("userId", "name email");
}

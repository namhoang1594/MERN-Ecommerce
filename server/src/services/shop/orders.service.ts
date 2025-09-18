import OrderModel from "../../models/orders.model";
import { IOrder } from "../../types/orders.types";

// User: lấy danh sách đơn hàng của chính mình
export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
    return await OrderModel.find({ userId }).sort({ createdAt: -1 });
}

// User: lấy chi tiết 1 đơn hàng (chỉ được xem đơn hàng của mình)
export const getUserOrderById = async (userId: string, orderId: string): Promise<IOrder | null> => {
    return await OrderModel.findOne({ _id: orderId, userId })
        .populate("items.productId", "name thumbnail price")
        .sort({ createdAt: -1 });;
}
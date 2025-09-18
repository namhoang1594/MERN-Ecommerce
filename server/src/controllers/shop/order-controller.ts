import { Request, Response } from "express";
import { getUserOrderById, getUserOrders } from "../../services/shop/orders.service";


// User
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const orders = await getUserOrders(userId);
    return res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { id } = req.params;
    const order = await getUserOrderById(userId, id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    console.error("Get my order detail error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
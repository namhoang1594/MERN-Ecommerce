import { Request, Response } from "express";
import { getAllOrdersAdmin, getOrderByIdAdmin, updateOrderStatusAdmin } from "../../services/admin/orders.service";
import { OrderStatus } from "../../types/orders.types";

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersAdmin();
    return res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdAdmin(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get order detail error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await updateOrderStatusAdmin(id, status);
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    return res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
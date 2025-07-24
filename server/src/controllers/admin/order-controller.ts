import { Request, Response } from "express";
import {
  findAllOrders,
  findOrderById,
  updateOrderStatusById
} from "../../services/admin/orders.service";


export const getAllOrdersOfAllUser = async (_req: Request, res: Response) => {
  try {
    const orders = await findAllOrders();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error("[getAllOrdersOfAllUser]", e);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const getOrderDetailsAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await findOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error("[getOrderDetailsAdmin]", e);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await updateOrderStatusById(id, orderStatus);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
    });
  } catch (e) {
    console.error("[updateOrderStatus]", e);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};
import { Request, Response } from "express";
import {
  createPaypalOrder,
  capturePaypalOrder,
  getOrdersByUser,
  getOrderById
} from "../../services/shop/orders.service";


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, cartId, cartItems, addressInfo, totalAmount } = req.body;

    if (!userId || !cartId || !cartItems || !addressInfo || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Thông tin đơn hàng không đầy đủ!",
      });
    }

    const { approvalUrl, orderId } = await createPaypalOrder(
      userId,
      cartId,
      cartItems,
      addressInfo,
      totalAmount
    );

    res.status(201).json({
      success: true,
      approvalUrl: approvalUrl,
      orderId
    });

  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng qua PayPal! Vui lòng thử lại sau.",
      error: (error as Error).message,
    });
  }
};

export const capturePayment = async (req: Request, res: Response) => {
  try {
    const { paypalOrderId, mongoOrderId } = req.body;

    if (!paypalOrderId || !mongoOrderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin đơn hàng hoặc ID giao dịch PayPal!",
      });
    }

    const order = await capturePaypalOrder(paypalOrderId, mongoOrderId);


    res.status(200).json({
      success: true,
      message: "Thanh toán thành công!",
      data: order,
    });
  } catch (error: any) {
    console.error("capturePayment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xác nhận thanh toán! Vui lòng thử lại sau.",
    });
  }
};

export const getAllOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await getOrdersByUser(userId);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

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
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  }
};
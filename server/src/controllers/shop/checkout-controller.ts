import { Request, Response } from "express";
import { PaymentMethod } from "../../types/orders.types";
import { cancelPayPalPayment, capturePayPalPayment, createCODOrder, createPayPalOrder } from "../../services/shop/checkout.service";


export const createOrder = async (req: Request, res: Response) => {
    try {
        const { shippingInfo, items, paymentMethod, shippingFee, note } = req.body;
        const userId = req.user!._id; // đã có từ middleware auth

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone) {
            return res.status(400).json({ message: "Missing shipping information" });
        }

        if (paymentMethod === PaymentMethod.COD) {
            const order = await createCODOrder(userId, shippingInfo, items, shippingFee, note);
            return res.status(201).json({
                success: true,
                orderId: order.id.toString(),
                order
            });
        }

        if (paymentMethod === PaymentMethod.PAYPAL) {
            const { order, paymentUrl } = await createPayPalOrder(
                userId,
                shippingInfo,
                items,
                shippingFee,
                note
            );
            return res.status(201).json({
                success: true,
                orderId: order.id.toString(),
                order,
                redirectUrl: paymentUrl
            });
        }

        return res.status(400).json({ message: "Invalid payment method" });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const paypalSuccess = async (req: Request, res: Response) => {
    try {
        const { token, orderId } = req.query; // PayPal Checkout SDK uses 'token' instead of paymentId

        if (!token || !orderId) {
            return res.status(400).json({ message: "Missing payment parameters" });
        }

        const updatedOrder = await capturePayPalPayment(
            token as string,
            orderId as string
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment completed successfully",
            order: updatedOrder
        });
    } catch (error: any) {
        console.error("PayPal success callback error:", error);
        res.status(500).json({
            message: "Payment processing failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const paypalCancel = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({ message: "Missing order ID" });
        }

        const cancelledOrder = await cancelPayPalPayment(orderId as string);

        if (!cancelledOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment cancelled",
            order: cancelledOrder
        });
    } catch (error: any) {
        console.error("PayPal cancel callback error:", error);
        res.status(500).json({
            message: "Payment cancellation failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
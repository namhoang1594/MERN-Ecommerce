import { getPaypalClient } from "../../helpers/paypal";
import OrderModel from "../../models/orders.model";
import { IOrder, IOrderItem, IShippingInfo, OrderStatus, PaymentMethod } from "../../types/orders.types";
import paypal from "@paypal/checkout-server-sdk";

export const createCODOrder = async (
    userId: string,
    shippingInfo: IShippingInfo,
    items: IOrderItem[],
    shippingFee: number = 0,
    note?: string
): Promise<IOrder> => {
    // Tính toán
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
    const finalAmount = totalAmount + shippingFee;

    const order = new OrderModel({
        userId,
        shippingInfo,
        items,
        paymentMethod: PaymentMethod.COD,
        status: OrderStatus.PENDING,
        totalAmount,
        shippingFee,
        finalAmount,
        note,
    });

    return await order.save();
}

export const createPayPalOrder = async (
    userId: string,
    shippingInfo: IShippingInfo,
    items: IOrderItem[],
    shippingFee: number = 0,
    note?: string
): Promise<{ order: IOrder; paymentUrl: string }> => {
    // Tính toán VND trước khi convert
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
    const finalAmount = totalAmount + shippingFee;

    // Tạo order trong DB
    const order = new OrderModel({
        userId,
        shippingInfo,
        items,
        paymentMethod: PaymentMethod.PAYPAL,
        status: OrderStatus.AWAITING_PAYMENT,
        totalAmount,
        shippingFee,
        finalAmount,
        note,
    });

    const savedOrder = await order.save();

    try {
        const client = getPaypalClient();

        // Convert VND -> USD
        const exchangeRate = parseFloat(process.env.VND_TO_USD_RATE || "26380");
        const shippingUSD = +(shippingFee / exchangeRate).toFixed(2);

        // Tạo list item USD
        const itemsUSD = items.map((item) => ({
            name: item.name,
            unit_amount: {
                currency_code: "USD",
                value: (item.priceAtPurchase / exchangeRate).toFixed(2),
            },
            quantity: item.quantity.toString(),
            description: item.variant || "",
            sku: item.productId.toString(),
            category: "PHYSICAL_GOODS" as "PHYSICAL_GOODS",
        }));

        // Tính lại subtotalUSD từ items (để khớp PayPal rule)
        const subtotalUSD = itemsUSD.reduce(
            (sum, it) =>
                sum + parseFloat(it.unit_amount.value) * parseInt(it.quantity, 10),
            0
        );

        const totalUSD = subtotalUSD + shippingUSD;

        // Request tạo PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: savedOrder.id.toString(),
                    description: `Order ${savedOrder._id}`,
                    amount: {
                        currency_code: "USD",
                        value: totalUSD.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: subtotalUSD.toFixed(2),
                            },
                            shipping: {
                                currency_code: "USD",
                                value: shippingUSD.toFixed(2),
                            },
                            handling: {
                                currency_code: 'USD',
                                value: "0.00",
                            },
                            tax_total: {
                                currency_code: 'USD',
                                value: "0.00",
                            },
                            insurance: {
                                currency_code: 'USD',
                                value: "0.00",
                            },
                            shipping_discount: {
                                currency_code: 'USD',
                                value: "0.00",
                            },
                            discount: {
                                currency_code: 'USD',
                                value: "0.00",
                            },
                        },
                    },
                    items: itemsUSD,
                    shipping: {
                        name: {
                            full_name: shippingInfo.fullName,
                        },
                        address: {
                            address_line_1: shippingInfo.street,
                            address_line_2: shippingInfo.ward,
                            admin_area_2: shippingInfo.province,
                            country_code: "VN",
                        },
                    },
                },
            ],
            application_context: {
                return_url: `${process.env.CLIENT_URL}/checkout/paypal/success?orderId=${savedOrder._id}`,
                cancel_url: `${process.env.CLIENT_URL}/checkout/paypal/cancel?orderId=${savedOrder._id}`,
                brand_name: process.env.BRAND_NAME || "E Shop",
                locale: "vi-VN",
                landing_page: "BILLING",
                shipping_preference: "SET_PROVIDED_ADDRESS",
                user_action: "PAY_NOW",
            },
        });

        const response = await client.execute(request);
        const paypalOrder = response.result;

        const approvalLink = paypalOrder.links.find(
            (link: any) => link.rel === "approve"
        );
        if (!approvalLink) {
            throw new Error("PayPal approval link not found");
        }

        // Lưu PayPal orderId vào DB
        savedOrder.paymentResult = {
            provider: "paypal",
            orderId: paypalOrder.id,
            status: paypalOrder.status,
            raw: paypalOrder,
        };
        await savedOrder.save();

        return { order: savedOrder, paymentUrl: approvalLink.href };
    } catch (error: any) {
        await OrderModel.findByIdAndUpdate(savedOrder._id, {
            status: OrderStatus.CANCELLED,
        });

        console.error("PayPal order creation error:", error);
        throw new Error(`PayPal payment creation failed: ${error.message}`);
    }
};


export const capturePayPalPayment = async (
    paypalOrderId: string,
    orderId: string
): Promise<IOrder | null> => {
    try {
        const client = getPaypalClient();

        // Capture PayPal payment
        const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
        const response = await client.execute(request);
        const captureResult = response.result;

        // Update our order with payment result
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
                paymentResult: {
                    provider: 'paypal',
                    orderId: captureResult.id,
                    transactionId: captureResult.purchase_units[0]?.payments?.captures[0]?.id,
                    status: captureResult.status,
                    raw: captureResult,
                    paidAt: captureResult.status === "COMPLETED" ? new Date() : null
                },
                status: captureResult.status === "COMPLETED" ? OrderStatus.PAID : OrderStatus.PENDING
            },
            { new: true }
        );

        return updatedOrder;

    } catch (error: any) {
        // Update order status to failed
        await OrderModel.findByIdAndUpdate(orderId, {
            status: OrderStatus.CANCELLED,
            paymentResult: {
                provider: 'paypal',
                orderId: paypalOrderId,
                status: 'FAILED',
                raw: { error: error.message }
            }
        });

        console.error('PayPal capture error:', error);
        throw new Error(`PayPal payment capture failed: ${error.message}`);
    }
}

export const cancelPayPalPayment = async (orderId: string): Promise<IOrder | null> => {
    return await OrderModel.findByIdAndUpdate(
        orderId,
        {
            status: OrderStatus.CANCELLED,
            paymentResult: {
                provider: 'paypal',
                status: 'CANCELLED',
                paidAt: null
            }
        },
        { new: true }
    );
}

export const getPayPalOrderDetails = async (paypalOrderId: string) => {
    try {
        const client = getPaypalClient();
        const request = new paypal.orders.OrdersGetRequest(paypalOrderId);
        const response = await client.execute(request);
        return response.result;
    } catch (error: any) {
        console.error('PayPal get order error:', error);
        throw new Error(`Failed to get PayPal order details: ${error.message}`);
    }
}

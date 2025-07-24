import Order from "../../models/orders.model";
import Product from "../../models/products.model";
import Cart from "../../models/cart.model";
import paypal from "@paypal/checkout-server-sdk";
import { IOrderItem, IAddressInfo, PaymentMethod, PaymentStatus, OrderStatus } from "../../types/orders.types";
import { getPaypalClient } from "../../helpers/paypal";

export const createPaypalOrder = async (
    userId: string,
    cartId: string,
    cartItems: IOrderItem[],
    addressInfo: IAddressInfo,
    totalAmount: number
) => {
    const itemList = cartItems.map((item) => ({
        name: item.title,
        unit_amount: {
            currency_code: "USD",
            value: parseFloat(item.price).toFixed(2),
        },
        quantity: item.quantity.toString(),
        sku: item.productId,
        category: "PHYSICAL_GOODS" as any,
    }));

    const totalValue = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
    );

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: totalValue.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: totalValue.toFixed(2),
                        },
                        discount: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                        handling: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                        insurance: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                        shipping: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                        shipping_discount: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                        tax_total: {
                            currency_code: "USD",
                            value: "0.00",
                        },
                    },
                },
                items: itemList,
            },
        ],
        application_context: {
            return_url: "http://localhost:5173/shop/paypal-return",
            cancel_url: "http://localhost:5173/shop/paypal-cancel",
            user_action: "PAY_NOW",
        },
    });

    const client = getPaypalClient();

    const response = await client.execute(request);

    const approvalUrl = response.result.links.find((link: any) => link.rel === "approve")?.href;

    const newOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: OrderStatus.PROCESSING,
        paymentMethods: PaymentMethod.PAYPAL,
        paymentStatus: PaymentStatus.PENDING,
        totalAmount: totalValue,
        paymentId: response.result.id,
        orderDate: new Date(),
    });

    await newOrder.save();

    return { approvalUrl, orderId: newOrder._id };
};

export const capturePaypalOrder = async (paypalOrderId: string, mongoOrderId: string) => {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({} as any);

    const client = getPaypalClient();

    const capture = await client.execute(request);

    const { id: paymentId, payer } = capture.result;
    const payerId = payer?.payer_id || "";

    const order = await Order.findById(mongoOrderId);

    if (!order) throw new Error("Order not found");

    order.paymentStatus = PaymentStatus.COMPLETED;
    order.orderStatus = OrderStatus.CONFIRMED;
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        if (product.totalStock < item.quantity) {
            throw new Error(`Not enough stock for product: ${product.title}`);
        }

        product.totalStock -= item.quantity;
        await product.save();
    }

    if (order.cartId) {
        await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();
    return order;
};

export const getOrdersByUser = async (userId: string) => {
    return await Order.find({ userId });
};

export const getOrderById = async (orderId: string) => {
    return await Order.findById(orderId);
};

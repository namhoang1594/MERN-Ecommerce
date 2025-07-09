const paypal = require("../../helpers/paypal");
const Order = require("../../models/orders");
const Product = require("../../models/products");
const Cart = require("../../models/cart");
const {
  orders: { OrdersCreateRequest, OrdersCaptureRequest },
} = require("@paypal/checkout-server-sdk");

const createOrder = async (req, res) => {
  try {
    const { userId, cartId, cartItems, addressInfo, totalAmount } = req.body;

    const itemList = cartItems.map((item) => ({
      name: item.title,
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2),
      },
      quantity: item.quantity.toString(),
      sku: item.productId,
    }));

    const totalValue = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const request = new OrdersCreateRequest();
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

    const response = await paypal.execute(request);
    const approvalUrl = response.result.links.find(
      (link) => link.rel === "approve"
    )?.href;

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "PENDING",
      paymentMethod: "paypal",
      paymentStatus: "PENDING",
      totalAmount: totalValue,
      paymentId: response.result.id,
      orderDate: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      approvalURL: approvalUrl,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("createOrder error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while creating PayPal order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paypalOrderId, mongoOrderId } = req.body;

    if (!paypalOrderId || !mongoOrderId) {
      return res.status(400).json({
        success: false,
        message: "Missing paypalOrderId or mongoOrderId",
      });
    }

    const request = new OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const capture = await paypal.execute(request);
    const { id: paymentId, payer } = capture.result;
    const payerId = payer?.payer_id || "";

    let order = await Order.findById(mongoOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "COMPLETED";
    order.orderStatus = "CONFIRMED";
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured and order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("capturePayment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while capturing payment",
    });
  }
};

module.exports = { createOrder, capturePayment };

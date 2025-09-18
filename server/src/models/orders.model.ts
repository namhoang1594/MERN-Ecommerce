import { Schema, model, Document, Types } from "mongoose";
import { IOrder, IOrderItem, IPaymentResult, IShippingInfo, OrderStatus, PaymentMethod } from "../types/orders.types";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    variant: { type: String, default: null },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ShippingInfoSchema = new Schema<IShippingInfo>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    ward: { type: String, required: true },
    province: { type: String, required: true },
  },
  { _id: false }
);

const PaymentResultSchema = new Schema<IPaymentResult>(
  {
    provider: { type: String },
    transactionId: { type: String },
    orderId: { type: String },
    payerId: { type: String },
    status: { type: String },
    raw: { type: Schema.Types.Mixed },
    paidAt: { type: Date },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    items: { type: [OrderItemSchema], required: true, default: [] },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentResult: { type: PaymentResultSchema, default: null },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    note: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
OrderSchema.index({ userId: 1, status: 1, createdAt: -1 });

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;
import { model, Schema, Document } from "mongoose";
import { IOrder, OrderStatus, PaymentMethod, PaymentStatus } from "../types/orders.types";

const OrderItemSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
});

const AddressInfoSchema = new Schema({
  addressId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
});

const OrderSchema = new Schema<IOrder & Document>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true
  },
  cartItems: [OrderItemSchema],
  addressInfo: AddressInfoSchema,
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PROCESSING,
  },
  paymentMethods: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderUpdateDate: {
    type: Date
  },
  paymentId: {
    type: String
  },
  payerId: {
    type: String
  },
});

const Order = model<IOrder & Document>("Order", OrderSchema);

export default Order;

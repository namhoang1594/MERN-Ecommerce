import { Types } from "mongoose";

export enum PaymentMethod {
    PAYPAL = "paypal",
    COD = "cod",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum OrderStatus {
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    CONFIRMED = "confirmed",
}

export interface IOrderItem {
    productId: string;
    title: string;
    image: string;
    price: string;
    quantity: number;
}

export interface IAddressInfo {
    addressId: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes?: string;
}

export interface IOrder {
    userId: Types.ObjectId;
    cartId: Types.ObjectId;
    cartItems: IOrderItem[];
    addressInfo: IAddressInfo;
    orderStatus: OrderStatus;
    paymentMethods: PaymentMethod;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    orderDate: Date;
    orderUpdateDate?: Date;
    paymentId?: string;
    payerId?: string;
}

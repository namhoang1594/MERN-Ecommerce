import { Document, Types } from "mongoose";

export enum OrderStatus {
    PENDING = "pending",        // vừa tạo
    PROCESSING = "processing",  // đang xử lý (vd: kiểm tra, chuẩn bị)
    AWAITING_PAYMENT = "awaiting_payment", // nếu cần
    PAID = "paid",
    SHIPPING = "shipping",
    DELIVERED = "delivered",
    // COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
}

export enum PaymentMethod {
    COD = "COD",
    PAYPAL = "PayPal"
    // VNPAY = "VNPAY", //VN k hỗ trợ localhost nên sẽ bổ sung sau
}

export interface IOrderItem {
    productId: Types.ObjectId;
    name: string;
    thumbnail?: string;
    variant?: string | null; // nếu có variant/option
    quantity: number;
    priceAtPurchase: number;
    subtotal: number; // quantity * priceAtPurchase
}

export interface IShippingInfo {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    province: string;
}

export interface IPaymentResult {
    provider?: string; // ex: 'vnpay', 'momo'
    transactionId?: string;
    orderId?: string; // PayPal order ID
    payerId?: string; // PayPal payer ID
    status?: string; // ex: 'success' | 'failed'
    raw?: any; // lưu raw response nếu cần (optional)
    paidAt?: Date | null;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    shippingInfo: IShippingInfo;
    items: IOrderItem[];
    paymentMethod: PaymentMethod;
    paymentResult?: IPaymentResult | null;
    status: OrderStatus;
    totalAmount: number;    // tổng trước phí, trước giảm
    shippingFee: number;
    finalAmount: number;    // tổng tiền cuối cùng (sau phí, giảm)
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
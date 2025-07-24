import { Addresses } from "../address-slice/address.types";

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    [key: string]: any;
}

export interface OrderDetails {
    _id: string;
    userId: string;
    cartItems: OrderItem[];
    addressInfo: Addresses;
    totalAmount: number;
    status: string;
    createdAt: string;
    [key: string]: any;
}

export interface OrderState {
    approvalURL: string | null;
    isLoading: boolean;
    orderId: string | null;
    orderList: OrderDetails[];
    orderDetails: OrderDetails | null;
}

export interface CreateOrderResponse {
    approvalUrl: string;
    orderId: string;
}

export interface CapturePaymentParams {
    paypalOrderId: string;
    mongoOrderId: string;
}

export interface CreateOrderPayload {
    userId: string;
    cartId?: string;
    cartItems: OrderItem[];
    addressInfo: Addresses;
    totalAmount: number;
}

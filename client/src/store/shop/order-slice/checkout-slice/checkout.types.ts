export enum PaymentMethod {
    COD = "COD",
    PAYPAL = "PayPal",
}

export interface ShippingInfo {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    province: string;
}

export interface CheckoutPayload {
    shippingInfo: ShippingInfo;
    items: {
        productId: string;
        name: string;
        thumbnail?: string;
        variant?: string | null;
        quantity: number;
        priceAtPurchase: number;
        subtotal: number;
    }[];
    paymentMethod: PaymentMethod;
    shippingFee?: number;
    note?: string;
}

export interface CheckoutState {
    loading: boolean;
    error: string | null;
    orderId: string | null;
    redirectUrl?: string;
}



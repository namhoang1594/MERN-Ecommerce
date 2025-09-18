export interface ShopOrder {
    _id: string;
    userId: string;
    status: string;
    paymentMethod: string;
    totalAmount: number;
    shippingFee: number;
    finalAmount: number;
    note?: string;
    createdAt: string;
    updatedAt: string;
    shippingInfo: {
        fullName: string;
        phone: string;
        street: string;
        ward: string;
        province: string;
    };
    items: {
        productId: string;
        name: string;
        thumbnail?: string;
        variant?: string | null;
        quantity: number;
        priceAtPurchase: number;
        subtotal: number;
    }[];
    paymentResult?: {
        provider?: string;
        orderId?: string;
        payerId?: string;
        transactionId?: string;
        status?: string;
        paidAt?: string;
        raw?: any;
    } | null;
}

export interface ShopOrdersState {
    list: ShopOrder[];
    detail: ShopOrder | null;
    loading: boolean;
    error: string | null;
}
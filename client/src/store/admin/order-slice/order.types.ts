export interface AdminOrder {
    _id: string;
    userId: { name: string; email: string };
    status: string;
    finalAmount: number;
    createdAt: string;
}

export interface AdminOrderDetail extends AdminOrder {
    items: {
        name: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    shippingInfo: {
        fullName: string;
        phone: string;
        street: string;
        ward: string;
        province: string;
    };
    paymentMethod: string;
}

export interface AdminOrdersState {
    list: AdminOrder[];
    detail: AdminOrderDetail | null;
    loading: boolean;
    error: string | null;
}
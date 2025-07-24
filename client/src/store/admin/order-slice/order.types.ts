export interface AddressInfo {
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

export interface CartItem {
    productId: string;
    title: string;
    quantity: number;
    price: number;
}

export interface OrderDetails {
    _id: string;
    userId: string;
    orderDate: string;
    orderStatus: string;
    paymentMethod?: string;
    paymentStatus?: string;
    totalAmount: number;
    addressInfo: AddressInfo;
    cartItems: CartItem[];
}

export interface AdminOrderState {
    orderList: OrderDetails[];
    orderDetails: OrderDetails | null;
    isLoading: boolean;
}

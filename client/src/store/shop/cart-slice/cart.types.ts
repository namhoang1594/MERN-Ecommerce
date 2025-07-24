
export interface CartItem {
    _id: string;
    userId: string;
    productId: string;
    quantity: number;
    title?: string;
    image?: string;
    price?: number;
    salePrice?: number;
    [key: string]: any;
}

export interface CartResponse {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CartState {
    cartItems: CartResponse | null;
    isLoading: boolean;
}



export interface AddToCartParams {
    userId: string;
    productId: string;
    quantity: number;
}

export interface UpdateCartParams {
    userId: string;
    productId: string;
    quantity: number;
}

export interface DeleteCartParams {
    userId: string;
    productId: string;
}

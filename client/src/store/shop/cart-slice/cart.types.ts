export interface CartProduct {
    _id: string;
    title: string;
    price: number;
    salePrice?: number;
    totalStock: number;
    image: { url: string; public_id: string }[];
    active: boolean;
}
export interface CartItem {
    _id: string;
    productId: string | CartProduct; // Populated hoặc chỉ ID
    quantity: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface LocalCartItem {
    productId: string;
    quantity: number;
    product: {
        title: string;
        image: { url: string; public_id: string }[];
        price: number;
        salePrice?: number;
        totalStock: number;
    };
    addedAt: number;
}

export interface CartState {
    serverCart: Cart | null;
    localCart: LocalCartItem[];
    loading: {
        fetch: boolean,
        update: boolean;
        merge: boolean;
    }
    error: string | null;
    isLoggedIn: boolean;
    itemOperations: Record<string, 'adding' | 'updating' | 'removing' | null>
    hasFetchedServerCart: boolean;
}
export interface ShopProduct {
    _id: string;
    title: string;
    slug: string;
    price: number;
    salePrice?: number;
    image: {
        url: string;
        public_id: string;
    }[];
    category: {
        _id: string;
        name: string
    };
    brand: {
        _id: string;
        name: string
    };
}

export interface ShopProductsFilterState {
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface ShopProductsState {
    products: ShopProduct[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    totalItems: number;
    filters: ShopProductsFilterState;
}

export interface ProductCardProps {
    _id: string;
    slug: string;
    title: string;
    image: {
        url: string;
        public_id: string;
    }[];
    category: string;
    brand: string;
    price: number;
    salePrice?: number;
    onAddToCart: (id: string) => void;
}

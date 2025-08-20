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
    category: {
        _id: string;
        name: string
    };
    brand: {
        _id: string;
        name: string
    };
    price: number;
    salePrice?: number;
    onAddToCart: (id: string) => void;
}

export interface ProductDetail extends ShopProduct {
    description: string;
    totalStock: number;
    specs?: Record<string, string>;
    rating?: number;
    reviews?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductDetailResponse {
    product: ProductDetail;
    relatedProducts: ShopProduct[];
}

export interface ProductDetailState {
    data: ProductDetailResponse | null;
    loading: boolean;
    error: string | null;
}


import { Product } from "@/store/admin/products-slice/product.types";

export interface ShopProductState {
    products: Product[];
    loading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number
    };
}
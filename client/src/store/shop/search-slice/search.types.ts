import { ShopProduct } from "../products-slice/allProducts-slice/allProducts.types";

export interface SearchState {
    results: ShopProduct[];
    loading: boolean;
    error: string | null;
    query: string;
    total: number
}
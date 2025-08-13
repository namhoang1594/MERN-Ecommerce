import { Product } from "@/store/admin/products-slice/product.types";

export interface SuggestionState {
    products: Product[];
    loading: boolean;
}
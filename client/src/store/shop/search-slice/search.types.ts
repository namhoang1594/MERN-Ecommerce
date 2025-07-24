import { Product } from "../../../types/products/product.types";

export interface SearchState {
    isLoading: boolean;
    searchResults: Product[];
}
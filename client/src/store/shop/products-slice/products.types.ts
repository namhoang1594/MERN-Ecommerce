import { Product } from "../../../types/products/product.types";

export interface ProductState {
    isLoading: boolean;
    productList: Product[];
    productDetails: Product | null;
}

export interface FetchAllFilteredProductsParams {
    filterParams: Record<string, string[]>;
    sortParams: string;
}

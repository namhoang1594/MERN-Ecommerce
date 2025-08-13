import { Product } from "@/store/admin/products-slice/product.types";

export interface NewArrivalState {
    products: Product[];
    loading: boolean;
}

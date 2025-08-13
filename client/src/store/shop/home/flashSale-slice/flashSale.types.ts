import { UploadedResult } from "@/types/config/index.types";

export interface FlashSaleProduct {
    _id?: string;
    title: string;
    description: string;
    price: number;
    salePrice: number;
    totalStock: number;
    image: UploadedResult[];
    category: string;
    brand: string;
    active: boolean;
    deletedImages?: string[];
    isFlashSale: boolean;
    slug: string;
    // flashSaleEnd: string;
}

export interface FlashSaleState {
    products: FlashSaleProduct[];
    loading: boolean;
    error: string | null;
}
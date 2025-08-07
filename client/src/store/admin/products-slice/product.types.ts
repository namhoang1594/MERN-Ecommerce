import { UploadedResult } from "@/types/config/index.types";

export interface Product {
    _id: string;
    image: ProductImage[];
    title: string;
    description?: string;
    category?: {
        _id: string;
        name: string;
    };
    brand?: {
        _id: string;
        name: string;
    };
    price: number;
    salePrice?: number;
    totalStock: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedImages?: string[];
}

export type ProductCreatePayload = Omit<Product, "_id" | "createdAt" | "updatedAt">;
export type ProductUpdatePayload = Partial<ProductCreatePayload>;

export interface ProductFormState {
    _id?: string;
    title: string;
    description: string;
    price: number;
    salePrice?: number;
    totalStock: number;
    image: UploadedResult[];
    category: string;
    brand: string;
    active: boolean;
    deletedImages?: string[];
}

export interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormState) => Promise<void>;
    isEdit: boolean;
    initialData?: ProductFormState;
    brands: { _id: string; name: string }[];
    categories: { _id: string; name: string }[];
}

export interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export interface ProductImage {
    url: string;
    public_id: string;
}
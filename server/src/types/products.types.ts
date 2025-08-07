import { Types } from "mongoose";
export interface IProduct {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    category: Types.ObjectId;
    brand: Types.ObjectId;
    price: number;
    salePrice?: number;
    totalStock: number;
    image: ProductImage[];
    createdAt?: Date;
    updatedAt?: Date;
    active: boolean;
    deletedImages?: string[];
}

export interface ProductImage {
    url: string;
    public_id: string;
}
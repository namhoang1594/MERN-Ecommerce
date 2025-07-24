import { Document, Types } from "mongoose";
import { IProduct } from "./products.types";

export interface ICartItem {
    productId: Types.ObjectId | IProduct;
    quantity: number;
}

export interface ICart {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    items: ICartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type CartDocument = ICart & Document;

export interface PopulatedCartItem {
    productId: IProduct
    quantity: number;
}
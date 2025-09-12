import { Document, Types } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

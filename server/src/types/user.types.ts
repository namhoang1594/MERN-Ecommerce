import { Types } from "mongoose";
import { Document } from "mongoose";

export enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    cart: string[]; // tạm thời lưu mảng productId, sau có thể refactor thành Cart model riêng
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
}
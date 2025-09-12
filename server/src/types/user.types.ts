import { Types } from "mongoose";
import { Document } from "mongoose";

export enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
}

export interface IUserAddress {
    _id?: Types.ObjectId;      // Mongo sẽ tự sinh khi push vào array
    fullName: string;
    phone: string;
    street: string;            // số nhà, đường
    ward: string;
    province: string;
    isDefault: boolean;
}
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    avatar: {
        url: string;
        public_id: string;
    };
    address: IUserAddress[];
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
}

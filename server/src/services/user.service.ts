import User from "../models/user.model";
import { IUser } from "../types/user.types";

export const findUserByEmail = (email: string) => {
    return User.findOne({ email });
};

export const createUser = (data: Partial<IUser>) => {
    return new User(data).save();
};
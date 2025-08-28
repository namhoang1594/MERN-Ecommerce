import bcrypt from "bcryptjs";
import { IUser } from "../../types/user.types";
import UserModel from "../../models/user.model";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "./token.service";

/**
 * Đăng ký user mới
 */
export const registerUserService = async (name: string, email: string, password: string): Promise<IUser> => {
    // 1. Kiểm tra user đã tồn tại chưa
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        refreshTokens: [],
    });

    // 4. Lưu DB
    await newUser.save();

    return newUser;
};

/**
 * Đăng nhập
 */
export const loginUserService = async (email: string, password: string) => {
    // 1. Tìm user
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // 2. Check mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // 3. Sinh token
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Lưu refresh token vào DB
    user.refreshTokens.push(refreshToken);
    await user.save();

    return { user, accessToken, refreshToken };
};

/**
 * Refresh access token bằng refresh token
 */
export const refreshTokenUserService = async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);


    const user = await UserModel.findById(payload.userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Kiểm tra refresh token có trong DB không
    if (!user.refreshTokens.includes(refreshToken)) {
        throw new Error("Invalid refresh token");
    }

    // TOKEN ROTATION - Remove old token, generate new tokens
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);

    const newAccessToken = generateAccessToken(payload.userId, user.role);
    const newRefreshToken = generateRefreshToken(payload.userId);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

/**
 * Remove Refresh Token from DB
 * @param userId - ID user
 * @param refreshToken - token cần xoá
 */
export const removeRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
    await UserModel.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
    });
};

/**
* Logout: xóa refresh token trong DB
*/
export const logoutUserService = async (userId: string, refreshToken: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    await removeRefreshToken(userId, refreshToken);
};

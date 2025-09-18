import bcrypt from "bcryptjs";
import UserModel from "../../models/user.model";
import { imageDeleteUtil } from "../../helpers/cloudinary";

export const getProfileService = async (userId: string) => {
    const user = await UserModel.findById(userId).select("-password -refreshTokens")
        .lean();

    if (!user) return null;

    // Mongo query để lấy thẳng địa chỉ mặc định
    const defaultAddress = await UserModel.findOne(
        { _id: userId, "address.isDefault": true },
        { "address.$": 1 } // chỉ lấy phần tử match
    ).lean();

    return {
        ...user,
        defaultAddress: defaultAddress?.address?.[0] || null,
    };
};

export const updateProfileService = async (
    userId: string,
    data: {
        name?: string;
        phone?: string;
        avatar?: { url: string; public_id: string };
    }
) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    // Nếu có avatar mới và user đã có avatar cũ → xóa avatar cũ
    if (data.avatar && user.avatar?.public_id) {
        try {
            await imageDeleteUtil(user.avatar.public_id);
            console.log(`Deleted old avatar: ${user.avatar.public_id}`);
        } catch (error) {
            console.error("Failed to delete old avatar:", error);
            // Không throw error để không block update profile
        }
    }
    return await UserModel.findByIdAndUpdate(userId, data, {
        new: true,
    }).select("-password -refreshTokens");
};

export const changePasswordService = async (
    userId: string,
    oldPassword: string,
    newPassword: string
) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Invalid old password");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return true;
};

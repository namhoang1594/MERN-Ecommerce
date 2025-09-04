import UserModel from "../../models/user.model";

export const getAllUsersService = async (search: string, page: number, limit: number) => {
    const query: any = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const users = await UserModel.find(query)
        .select("-password -refreshTokens")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const updateUserRoleService = async (id: string, role: string) => {
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
        throw new Error("User not found");
    }

    const user = await UserModel.findByIdAndUpdate(
        id,
        { role },
        { new: true }
    ).select("-password -refreshTokens");

    return user;
};

export const updateUserStatusService = async (id: string, isActive: boolean) => {
    const user = await UserModel.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
    ).select("-password -refreshTokens");

    return user;
};

export const deleteUserService = async (id: string) => {
    const user = await UserModel.findByIdAndDelete(id);
    return user;
};

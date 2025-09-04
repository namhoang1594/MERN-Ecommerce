import { Types } from "mongoose";
import UserModel from "../../models/user.model";

export const getAddressesService = async (userId: string) => {
    const user = await UserModel.findById(userId).select("address");
    if (!user) throw new Error("User not found");
    return user.address;
}

export const addAddressService = async (
    userId: string,
    addressData: {
        fullName: string;
        phone: string;
        street: string;            // số nhà, đường
        ward: string;
        province: string;
    }
) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const isFirstAddress = user.address.length === 0;

    const newAddress = {
        _id: new Types.ObjectId(),
        ...addressData,
        isDefault: isFirstAddress, // nếu là địa chỉ đầu tiên thì default
    };

    user.address.push(newAddress);
    await user.save();

    return newAddress;
}

export const updateAddressService = async (
    userId: string,
    addressId: string,
    addressData: Partial<{
        fullName: string;
        phone: string;
        street: string;            // số nhà, đường
        ward: string;
        province: string;
    }>
) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.address.find(
        (addr) => addr._id?.toString() === addressId
    );
    if (!address) throw new Error("Address not found");

    Object.assign(address, addressData);
    await user.save();

    return address;
}

export const deleteAddressService = async (userId: string, addressId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.address.findIndex(
        (addr) => addr._id?.toString() === addressId
    );
    if (address === -1) throw new Error("Address not found");

    const wasDefault = !!user.address[address].isDefault;

    user.address.splice(address, 1); // xóa địa chỉ
    await user.save();

    // Nếu xóa địa chỉ default và vẫn còn địa chỉ khác → gán cái đầu tiên thành default
    if (wasDefault && user.address.length > 0) {
        user.address[0].isDefault = true;
        await user.save();
    }

    return true;
}

export const setDefaultAddressService = async (userId: string, addressId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const address = user.address.find(
        (addr) => addr._id?.toString() === addressId
    );
    if (!address) throw new Error("Address not found");

    user.address.forEach((addr) => {
        addr.isDefault = addr._id?.toString() === addressId;
    });

    await user.save();
    return address;
}


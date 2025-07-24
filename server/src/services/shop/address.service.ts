import Address from "../../models/address.model";
import { IAddress } from "../../types/address.types";

export const createAddress = async (data: IAddress) => {
    const address = new Address(data);
    return await address.save();
};

export const getAddressesByUserId = async (userId: string) => {
    return await Address.find({ userId });
};

export const updateAddress = async (
    userId: string,
    addressId: string,
    formData: Partial<IAddress>
) => {
    return await Address.findOneAndUpdate(
        {
            _id: addressId,
            userId
        },
        formData,
        {
            new: true
        }
    );
};

export const removeAddress = async (userId: string, addressId: string) => {
    return await Address.findOneAndDelete(
        {
            _id: addressId,
            userId
        }
    );
};

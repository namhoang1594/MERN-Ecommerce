export interface Addresses {
    _id: string;
    userId: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    [key: string]: any;
}


export interface AddressState {
    addressList: Addresses[];
    isLoading: boolean;
}

export interface AddressFormData {
    address: string;
    city: string;
    phone: string;
    pincode: string;
    notes: string;
    [key: string]: any;
}

export interface EditAddressParams {
    userId: string;
    addressId: string;
    formData: AddressFormData;
}

export interface DeleteAddressParams {
    userId: string;
    addressId: string;
}

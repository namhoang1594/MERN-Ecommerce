import { UserStatus } from "@/store/admin/user-slice/user.types";
import { User } from "@/store/auth-slice/auth.types";

export type TabType = "info" | "addresses" | "password";

export interface Address {
    _id: string;
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    province: string;
    isDefault: boolean;
}

export interface UserProfile extends User {
    phone?: string;
    avatar?: {
        url: string;
        public_id: string;
    };
    status: UserStatus;
}

export interface ProfileState {
    info: UserProfile | null;
    addresses: Address[];
    loading: boolean;
    error: string | null;
}
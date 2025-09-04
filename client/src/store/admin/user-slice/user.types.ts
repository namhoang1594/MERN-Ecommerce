import { User, UserRole } from "@/store/auth-slice/auth.types";

export type UserStatus = "active" | "inactive";

export interface AdminUser extends User {
    isActive: boolean;
}

export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
}

export interface AdminUserState {
    list: AdminUser[];
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    search: string;
    filter: {
        role?: UserRole;
        status?: UserStatus;
    };
}

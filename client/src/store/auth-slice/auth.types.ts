export type UserRole = "customer" | "admin";
export interface User {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

export interface AuthError {
    message: string;
    field?: string; // cho validation errors
    code?: string;  // error codes
}

export interface FormErrors {
    [key: string]: string;
}
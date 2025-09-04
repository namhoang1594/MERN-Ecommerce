import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Address, ProfileState, UserProfile } from "./user-profile.types";
import axiosInstance from "@/lib/axios";

const initialState: ProfileState = {
    info: null,
    addresses: [],
    loading: false,
    error: null,
};

// ==== Thunks ====

// Lấy thông tin profile từ BE (JWT tự động gửi kèm trong axios instance)
export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/shop/profile/me");
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Fetch profile failed");
        }
    }
);

// Update profile (name, phone, avatar)
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data: Partial<UserProfile>, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put("/shop/profile/me", data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update profile failed");
        }
    }
);

export const changePassword = createAsyncThunk(
    "profile/changePassword",
    async (data: { oldPassword: string, newPassword: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put("/shop/profile/change-password", data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Change password failed");
        }
    }
);

// ==== Address CRUD ====
export const fetchAddresses = createAsyncThunk(
    "profile/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/shop/profile/addresses");
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Fetch addresses failed");
        }
    }
);

export const addAddress = createAsyncThunk(
    "profile/addAddress",
    async (data: Omit<Address, "_id">, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/shop/profile/addresses", data);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Add address failed");
        }
    }
);

export const updateAddress = createAsyncThunk(
    "profile/updateAddress",
    async (
        { id, data }: { id: string; data: Partial<Address> },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.put(`/shop/profile/addresses/${id}`, data);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update address failed");
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "profile/deleteAddress",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/shop/profile/addresses/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Delete address failed");
        }
    }
);

export const setDefaultAddress = createAsyncThunk(
    "profile/setDefaultAddress",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/shop/profile/addresses/${id}/set-default`);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Set default address failed");
        }
    }
);

// ==== Slice ====
const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.info = null;
            state.addresses = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.loading = false;
                state.info = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
                state.info = action.payload;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.error = null;
            })

            // Addresses
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.addresses = action.payload;
            })
            .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                state.addresses.push(action.payload);
            })
            .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                const idx = state.addresses.findIndex((a) => a._id === action.payload._id);
                if (idx !== -1) state.addresses[idx] = action.payload;
            })
            .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
                state.addresses = state.addresses.filter((a) => a._id !== action.payload);
            })
            .addCase(setDefaultAddress.fulfilled, (state, action: PayloadAction<Address[] | Address>) => {
                if (Array.isArray(action.payload)) {
                    state.addresses = action.payload;
                } else {
                    // Nếu BE trả về 1 address, tự xử lý đặt default trong state
                    const id = action.payload._id;
                    state.addresses = state.addresses.map(a => ({
                        ...a,
                        isDefault: a._id === id,
                    }));
                }
            });
    },
});

export const { clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
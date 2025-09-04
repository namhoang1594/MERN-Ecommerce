import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AdminUserState, Pagination } from "./user.types";
import axiosInstance from "@/lib/axios";
import { UserRole } from "@/store/auth-slice/auth.types";

const initialState: AdminUserState = {
    list: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    search: "",
    filter: {},
};

/**
 * Thunk: fetchUsers
 */
export const fetchUsers = createAsyncThunk(
    "userManagement/fetchUsers",
    async (
        {
            page,
            limit,
            search,
            filter,
        }: {
            page?: number;
            limit?: number;
            search?: string;
            filter?: { role?: UserRole; status?: "active" | "inactive" };
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/admin/users", {
                params: { page, limit, search, ...filter },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Fetch users failed");
        }
    }
);

/**
 * Thunk: updateRole
 */
export const updateRole = createAsyncThunk(
    "userManagement/updateRole",
    async ({ userId, role }: { userId: string; role: UserRole }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update role failed");
        }
    }
);

/**
 * Thunk: updateStatus
 */
export const updateStatus = createAsyncThunk(
    "userManagement/updateStatus",
    async ({ userId, isActive }: { userId: string; isActive: boolean }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}/status`, { isActive });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update status failed");
        }
    }
);

/**
 * Thunk: deleteUser
 */
export const deleteUser = createAsyncThunk(
    "userManagement/deleteUser",
    async (userId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            return userId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Delete user failed");
        }
    }
);

const adminUsersSlice = createSlice({
    name: "adminUsers",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setFilter: (
            state,
            action: PayloadAction<{ role?: UserRole; status?: "active" | "inactive" }>
        ) => {
            state.filter = action.payload;
        },
        setPagination: (state, action: PayloadAction<Pagination>) => {
            state.pagination = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // updateRole
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.list.findIndex((u) => u._id === action.payload._id);
                if (index !== -1) {
                    state.list[index].role = action.payload.role;
                }
            })

            // updateStatus
            .addCase(updateStatus.fulfilled, (state, action) => {
                const index = state.list.findIndex((u) => u._id === action.payload._id);
                if (index !== -1) {
                    state.list[index].isActive = action.payload.isActive;
                }
            })

            // deleteUser
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter((u) => u._id !== action.payload);
            });
    },
});

export const { setSearch, setFilter, setPagination } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
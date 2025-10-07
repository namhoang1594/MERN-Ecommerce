import axiosInstance from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BannerState, IBanner } from "./banner.types";

const initialState: BannerState = {
    banners: [],
    loading: false,
    error: null,
};

// PUBLIC: Fetch active banners for shop
export const fetchPublicBanners = createAsyncThunk(
    "banners/fetchPublic",
    async ({ position }: { position?: string }, { rejectWithValue }) => {
        try {
            const url = position
                ? `/admin/banners/public?position=${position}`
                : `/admin/banners/public`;
            const res = await axiosInstance.get(url);
            return res.data.data as IBanner[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải banners");
        }
    }
);

// ADMIN: Fetch all banners (bao gồm inactive)
export const fetchBanners = createAsyncThunk(
    "banners/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/admin/banners/get", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return res.data.data as IBanner[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải banners");
        }
    }
);

// CREATE banner
export const createBanner = createAsyncThunk(
    "banners/create",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/admin/banners/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return res.data.data as IBanner;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tạo banner");
        }
    }
);

// UPDATE banner
export const updateBanner = createAsyncThunk(
    "banners/update",
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/admin/banners/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return res.data.data as IBanner;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật banner");
        }
    }
);

// TOGGLE status
export const toggleBannerStatus = createAsyncThunk(
    "banners/toggle",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(
                `/admin/banners/toggle/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return res.data.data as IBanner;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi toggle banner");
        }
    }
);

// DELETE banner
export const deleteBanner = createAsyncThunk(
    "banners/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/admin/banners/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa banner");
        }
    }
);

const bannerSlice = createSlice({
    name: "banners",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all (admin)
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.banners = action.payload;
                state.loading = false;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch public
            .addCase(fetchPublicBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicBanners.fulfilled, (state, action) => {
                state.banners = action.payload;
                state.loading = false;
            })
            .addCase(fetchPublicBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create
            .addCase(createBanner.fulfilled, (state, action) => {
                state.banners.unshift(action.payload);
            })

            // Update
            .addCase(updateBanner.fulfilled, (state, action) => {
                const index = state.banners.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                }
            })

            // Toggle
            .addCase(toggleBannerStatus.fulfilled, (state, action) => {
                const index = state.banners.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                }
            })

            // Delete
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter(b => b._id !== action.payload);
            });
    },
});

export const { clearError } = bannerSlice.actions;
export default bannerSlice.reducer;
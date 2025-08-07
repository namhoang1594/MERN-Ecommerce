import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BannerState, IBanner } from "./banner.types";

const initialState: BannerState = {
    banners: [],
    loading: false,
};

export const fetchBanners = createAsyncThunk(
    "banners/fetch",
    async () => {
        const res = await axios.get("http://localhost:5000/api/admin/banners/get");
        return res.data as IBanner[];
    });

export const createBanner = createAsyncThunk(
    "banners/create",
    async (formData: FormData) => {
        const res = await axios.post(
            "http://localhost:5000/api/admin/banners/create",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return res.data as IBanner;
    }
);


export const toggleBannerStatus = createAsyncThunk(
    "banners/toggleStatus",
    async ({ id, isActive }: { id: string; isActive: boolean }) => {
        const res = await axios.put(
            `http://localhost:5000/api/admin/banners/toggle/${id}`
        );
        return res.data.banner as IBanner;
    }
);


export const deleteBanner = createAsyncThunk(
    "banners/delete",
    async (id: string) => {
        await axios.delete(`http://localhost:5000/api/admin/banners/${id}`);
        return id;
    });

const bannerSlice = createSlice({
    name: "banners",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.banners = action.payload;
                state.loading = false;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.banners.push(action.payload);
            })
            .addCase(toggleBannerStatus.fulfilled, (state, action) => {
                const updatedBanner = action.payload;
                const index = state.banners.findIndex(b => b._id === updatedBanner._id);
                if (index !== -1) {
                    state.banners[index] = updatedBanner;
                }
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter((b) => b._id !== action.payload);
            });
    },
});

export default bannerSlice.reducer;

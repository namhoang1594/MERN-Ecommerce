import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Banner, BannerState } from "./banner.types";

const initialState: BannerState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchBannersForShop = createAsyncThunk(
    "banners/fetch", async (): Promise<Banner[]> => {
        const res = await axios.get("http://localhost:5000/api/admin/banners/get");
        return res.data;
    });

const bannersShopSlice = createSlice({
    name: "shopBanners",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBannersForShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBannersForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBannersForShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch banners";
            });
    },
});

export default bannersShopSlice.reducer;
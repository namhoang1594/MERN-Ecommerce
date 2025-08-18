import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Brand, BrandState } from "./brand.types";

const initialState: BrandState = {
    brands: [],
    loading: false,
    error: null,
};

export const fetchBrandsForShop = createAsyncThunk(
    "/brands/fetchBrandsForShop",
    async (): Promise<Brand[]> => {
        const response = await axios.get("http://localhost:5000/api/shop/brands/get");
        return response.data.data;
    }
);

const brandShopSlice = createSlice({
    name: "shopBrands",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrandsForShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrandsForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrandsForShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load brands";
            });
    },
});

export default brandShopSlice.reducer;
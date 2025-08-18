import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, CategoryHomeState } from "./category.types";

const initialState: CategoryHomeState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategoriesForShop = createAsyncThunk(
    "/categories/fetch",
    async (): Promise<Category[]> => {
        const response = await axios.get("http://localhost:5000/api/shop/categories/get");
        return response.data.data;
    }
);

const categoryShopSlice = createSlice({
    name: "shopCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesForShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoriesForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategoriesForShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load categories";
            });
    },
});

export default categoryShopSlice.reducer;

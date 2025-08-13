import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ShopProductState } from "./allProducts.types";

const initialState: ShopProductState = {
    products: [],
    loading: false,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

export const fetchAllProductsForShop = createAsyncThunk(
    "shopProducts/fetchAll",
    async ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => {
        const res = await axios.get(`http://localhost:5000/api/admin/products/grid-allProduct`, {
            params: { page, limit },
        });
        return res.data;
    }
);

const shopAllProductsSlice = createSlice({
    name: "shopAllProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProductsForShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllProductsForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAllProductsForShop.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default shopAllProductsSlice.reducer;

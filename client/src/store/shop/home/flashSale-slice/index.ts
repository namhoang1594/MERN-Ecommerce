import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FlashSaleProduct, FlashSaleState } from "./flashSale.types";

const initialState: FlashSaleState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchFlashSaleForShop = createAsyncThunk(
    "flashSale/fetchFlashSaleProducts",
    async (): Promise<FlashSaleProduct[]> => {
        const response = await axios.get("http://localhost:5000/api/admin/products/flash-sale");
        return response.data;
    }
);

const flashSaleShopSlice = createSlice({
    name: "shopFlashSale",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlashSaleForShop.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlashSaleForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchFlashSaleForShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching flash sale";
            });
    },
});

export default flashSaleShopSlice.reducer;

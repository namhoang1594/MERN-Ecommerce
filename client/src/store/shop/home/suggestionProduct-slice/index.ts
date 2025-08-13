import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SuggestionState } from "./suggestion.types";
import { Product } from "@/store/admin/products-slice/product.types";


const initialState: SuggestionState = {
    products: [],
    loading: false,
};

export const fetchSuggestionProductsForShop = createAsyncThunk(
    "suggestions/fetch",
    async () => {
        const res = await axios.get(
            "http://localhost:5000/api/admin/products/suggestions?limit=10"
        );
        return res.data as Product[];
    }
);

const suggestionProductShopSlice = createSlice({
    name: "shopSuggestions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestionProductsForShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuggestionProductsForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchSuggestionProductsForShop.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default suggestionProductShopSlice.reducer;
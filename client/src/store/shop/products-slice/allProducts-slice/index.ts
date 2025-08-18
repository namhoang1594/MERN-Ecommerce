import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopProductsFilterState, ShopProductsState } from "./allProducts.types";

const initialState: ShopProductsState = {
    products: [],
    loading: false,
    error: null,
    totalPages: 1,
    totalItems: 0,
    filters: {
        category: undefined,
        brand: undefined,
        priceMin: undefined,
        priceMax: undefined,
        sort: "",
        search: "",
        page: 1,
        limit: 12,
    },
};

export const fetchShopProducts = createAsyncThunk(
    "shopProducts/fetchShopProducts",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { shopAllProducts: ShopProductsState };
        try {
            const res = await axios.get("http://localhost:5000/api/shop/products/get", {
                params: state.shopAllProducts.filters,
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const shopProductsSlice = createSlice({
    name: "shopProducts",
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<ShopProductsFilterState>>) => {
            state.filters = { ...state.filters, ...action.payload, page: 1 }; // reset page when filters change
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.total;
            })
            .addCase(fetchShopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, setPage, resetFilters } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;

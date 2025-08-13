import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { NewArrivalState } from "./newArrival.types";
import { Product } from "@/store/admin/products-slice/product.types";

const initialState: NewArrivalState = {
    products: [],
    loading: false,
};

export const fetchNewArrivalsForShop = createAsyncThunk(
    "shop/newArrivals",
    async () => {
        const res = await axios.get("http://localhost:5000/api/admin/products/new-arrivals");
        return res.data as Product[];
    }
);

const newArrivalShopSlice = createSlice({
    name: "shopNewArrivals",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewArrivalsForShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNewArrivalsForShop.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchNewArrivalsForShop.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default newArrivalShopSlice.reducer;

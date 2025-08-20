import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductDetailResponse, ProductDetailState } from "./allProducts.types";


const initialState: ProductDetailState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchProductDetail = createAsyncThunk<
    ProductDetailResponse,
    string, // slug
    { rejectValue: string }
>("productDetail/fetchProductDetail", async (slug, { rejectWithValue }) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/shop/products/${slug}`);
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch product detail");
    }
});

const productDetailSlice = createSlice({
    name: "productDetail",
    initialState,
    reducers: {
        clearProductDetail: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action: PayloadAction<ProductDetailResponse>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { clearProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;
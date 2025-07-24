import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ProductState,
  FetchAllFilteredProductsParams,
} from "./products.types";

const initialState: ProductState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchallproducts",
  async ({ filterParams, sortParams }: FetchAllFilteredProductsParams) => {
    const query = new URLSearchParams();
    Object.entries(filterParams).forEach(([key, valueArray]) => {
      valueArray.forEach((val) => query.append(key, val));
    });
    query.append("sort", sortParams);

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );
    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchproductdetails",
  async (id: string) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );
    return result?.data;
  }
);

const shopProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shopProductSlice.actions;

export default shopProductSlice.reducer;

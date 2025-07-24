// shop/review-product-slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Review,
  ReviewState,
  AddReviewPayload,
} from "./review-product.types";

const initialState: ReviewState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk<
  { success: boolean },
  AddReviewPayload
>("/order/addReview", async (formdata) => {
  const response = await axios.post(
    `http://localhost:5000/api/shop/review/add`,
    formdata
  );
  return response.data;
});

export const getReview = createAsyncThunk<
  { data: Review[] },
  string
>("/order/getReview", async (id) => {
  const response = await axios.get(
    `http://localhost:5000/api/shop/review/${id}`
  );
  return response.data;
});

const reviewProductSlice = createSlice({
  name: "reviewProductSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action: PayloadAction<{ data: Review[] }>) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReview.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewProductSlice.reducer;

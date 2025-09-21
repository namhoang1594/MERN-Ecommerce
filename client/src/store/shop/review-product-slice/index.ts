import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ReviewState } from "./review-product.types";
import axiosInstance from "@/lib/axios";

const initialState: ReviewState = {
  reviews: [],
  total: 0,
  loading: false,
  error: null,
};

//GET reviews by product
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (
    { productId, page = 1, limit = 10 }: { productId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get(`/shop/reviews/get/${productId}`, {
        params: { page, limit },
      });
      return res.data; // { reviews, total }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//CREATE review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (
    { productId, rating, comment }: { productId: string; rating: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(
        "/shop/reviews/add",
        { productId, rating, comment },
        { withCredentials: true }
      );
      return res.data; // review
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//UPDATE review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (
    { id, rating, comment }: { id: string; rating: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.put(
        `/shop/reviews/edit/${id}`,
        { rating, comment },
        { withCredentials: true }
      );
      return res.data; // updated review
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

//DELETE review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/shop/reviews/delete/${id}`, { withCredentials: true });
      return id; // return deleted id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewsProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
      state.total = action.payload.total;
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.reviews.unshift(action.payload); // thêm review mới lên đầu
      state.total += 1;
    });

    // UPDATE
    builder.addCase(updateReview.fulfilled, (state, action) => {
      const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) {
        state.reviews[idx] = action.payload;
      }
    });

    // DELETE
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      state.total -= 1;
    });
  },
});

export default reviewSlice.reducer;

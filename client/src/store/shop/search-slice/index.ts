import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SearchState } from "./search.types";
import axiosInstance from "@/lib/axios";

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
  query: "",
  total: 0,
};

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/shop/search?query=${encodeURIComponent(query)}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "searchShop",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Search failed";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;

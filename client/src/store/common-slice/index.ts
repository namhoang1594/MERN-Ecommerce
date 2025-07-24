import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CommonFeatureState, FeatureImage } from "./common.types";

const initialState: CommonFeatureState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk<
  { data: FeatureImage[] }
>("/order/getFeatureImages", async () => {
  const response = await axios.get("http://localhost:5000/api/common/feature/get");
  return response.data;
});

export const addFeatureImages = createAsyncThunk<
  { success: boolean },
  string
>("/order/addFeatureImages", async (image: string) => {
  const response = await axios.post("http://localhost:5000/api/common/feature/add", {
    image,
  });
  return response.data;
});

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonSlice.reducer;

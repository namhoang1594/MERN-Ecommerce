import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DashboardState } from "./dashboard.types";

const initialState: DashboardState = {
    recentOrders: [],
    loadingRecentOrders: false,
};

export const getRecentOrders = createAsyncThunk(
    "adminDashboard/getRecentOrders",
    async () => {
        const response = await axios.get("/api/admin/dashboard/recent-orders");
        return response.data;
    }
);

const dashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRecentOrders.pending, (state) => {
                state.loadingRecentOrders = true;
            })
            .addCase(getRecentOrders.fulfilled, (state, action) => {
                state.recentOrders = action.payload;
                state.loadingRecentOrders = false;
            })
            .addCase(getRecentOrders.rejected, (state) => {
                state.loadingRecentOrders = false;
            });
    },
});

export default dashboardSlice.reducer;
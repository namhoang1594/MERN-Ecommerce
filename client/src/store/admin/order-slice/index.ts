import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AdminOrderState, OrderDetails } from "./order.types";

// Initial state
const initialState: AdminOrderState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

// Thunk: Lấy tất cả đơn hàng
export const getAllOrdersAdmin = createAsyncThunk<OrderDetails[]>(
  "/order/getAllOrdersAdmin",
  async () => {
    const response = await axios.get("http://localhost:5000/api/admin/orders/get");
    return response.data.data as OrderDetails[];
  }
);

// Thunk: Lấy chi tiết đơn hàng theo ID
export const getOrderDetailsAdmin = createAsyncThunk<OrderDetails, string>(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`);
    return response.data.data as OrderDetails;
  }
);

// Thunk: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk<
  { success: boolean; message: string },
  { id: string; orderStatus: string }
>(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/orders/update-status/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL ORDERS
      .addCase(getAllOrdersAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersAdmin.fulfilled, (state, action: PayloadAction<OrderDetails[]>) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrdersAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      // GET ORDER DETAILS
      .addCase(getOrderDetailsAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsAdmin.fulfilled, (state, action: PayloadAction<OrderDetails>) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetailsAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

// Actions & Reducer export
export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

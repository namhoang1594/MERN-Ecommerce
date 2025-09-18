import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ShopOrder, ShopOrdersState } from "./order.types";
import axiosInstance from "@/lib/axios";

const initialState: ShopOrdersState = {
  list: [],
  detail: null,
  loading: false,
  error: null,
};

// Lấy danh sách orders của user
export const fetchOrders = createAsyncThunk<ShopOrder[]>
  ("orders/fetchOrders",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get("/shop/orders");
        return data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Lỗi tải orders");
      }
    });

// Lấy chi tiết 1 order
export const fetchOrderDetail = createAsyncThunk<
  ShopOrder,
  string
>("orders/fetchOrderDetail", async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/shop/orders/${orderId}`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi tải chi tiết order");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderDetail(state) {
      state.detail = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchOrderDetail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderDetail, clearError } = ordersSlice.actions;

export default ordersSlice.reducer;
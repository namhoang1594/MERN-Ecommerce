import axiosInstance from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminOrder, AdminOrderDetail, AdminOrdersState } from "./order.types";

const initialState: AdminOrdersState = {
  list: [],
  detail: null,
  loading: false,
  error: null,
};

// fetch tất cả orders
export const fetchAllOrders = createAsyncThunk<AdminOrder[]>(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      return data.orders;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tải danh sách orders");
    }
  }
);

// fetch chi tiết 1 order
export const fetchOrderDetailAdmin = createAsyncThunk<AdminOrderDetail, string>(
  "adminOrders/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/admin/orders/${id}`);
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tải chi tiết order");
    }
  }
);

// update status order
export const updateOrderStatus = createAsyncThunk<
  AdminOrderDetail,
  { id: string; status: string }
>("adminOrders/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put(`/admin/orders/${id}/status`, { status });
    return data.order;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật trạng thái order");
  }
});

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    resetAdminOrderDetail(state) {
      state.detail = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchOrderDetailAdmin
      .addCase(fetchOrderDetailAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchOrderDetailAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateOrderStatus 
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
        // Update list item if exists
        const index = state.list.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.list[index].status = action.payload.status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdminOrderDetail, clearError } = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
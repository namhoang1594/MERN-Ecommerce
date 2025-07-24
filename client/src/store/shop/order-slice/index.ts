import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  OrderDetails,
  OrderState,
  CreateOrderResponse,
  CapturePaymentParams,
} from "./order.types";

const initialState: OrderState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk<CreateOrderResponse, any>(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post("http://localhost:5000/api/shop/order/create", orderData);
    return response.data;
  }
);

export const capturePayment = createAsyncThunk<any, CapturePaymentParams>(
  "/order/capturePayment",
  async ({ paypalOrderId, mongoOrderId }) => {
    const response = await axios.post("http://localhost:5000/api/shop/order/capture", {
      paypalOrderId,
      mongoOrderId,
    });
    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk<{ data: OrderDetails[] }, string>(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`);
    return response.data;
  }
);

export const getOrderDetailsId = createAsyncThunk<{ data: OrderDetails }, string>(
  "/order/getOrderDetailsId",
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/shop/order/details/${id}`);
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsId.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { CheckoutPayload, CheckoutState } from "./checkout.types";
import { clearCart, clearLocalCart } from "../../cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const initialState: CheckoutState = {
    loading: false,
    error: null,
    orderId: null,
    redirectUrl: undefined,
};

// const dispatch = useDispatch<AppDispatch>();

// ---- Async Action ----
export const createOrder = createAsyncThunk(
    "checkout/createOrder",
    async (payload: CheckoutPayload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/shop/checkout", payload);

            // try {
            //     await dispatch(clearCart()).unwrap();
            //     dispatch(clearLocalCart());
            // } catch (error) {
            //     dispatch(clearLocalCart());
            // }

            return res.data; // { orderId, redirectUrl? }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Checkout failed");
        }
    }
);

export const confirmPaypalPayment = createAsyncThunk(
    "checkout/confirmPaypal",
    async ({ token, orderId }: { token: string; orderId: string }, { rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/shop/checkout/paypal/success?token=${token}&orderId=${orderId}`
            );
            // try {
            //     await dispatch(clearCart()).unwrap();
            //     dispatch(clearLocalCart());
            // } catch (error) {
            //     dispatch(clearLocalCart());
            // }
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "PayPal confirmation failed");
        }
    }
);

// ---- Slice ----
const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        resetCheckout: () => initialState,
        clearRedirectUrl: (state) => {
            state.redirectUrl = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderId = action.payload.orderId;
                if (action.payload.redirectUrl) {
                    state.redirectUrl = action.payload.redirectUrl;
                }
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(confirmPaypalPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmPaypalPayment.fulfilled, (state, action) => {
                state.loading = false;
                // PayPal payment confirmed successfully
            })
            .addCase(confirmPaypalPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetCheckout, clearRedirectUrl } = checkoutSlice.actions;

export default checkoutSlice.reducer;
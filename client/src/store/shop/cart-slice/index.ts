import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CartItem,
  CartState,
  AddToCartParams,
  UpdateCartParams,
  DeleteCartParams,
} from "./cart.types";

const initialState: CartState = {
  cartItems: null,
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "/cart/addtocart",
  async ({ userId, productId, quantity }: AddToCartParams) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/cart/add",
      { userId, productId, quantity }
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "/cart/fetchCartItems",
  async (userId: string) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/cart/get/${userId}`
    );
    return response.data;
  }
);

export const updateCartItems = createAsyncThunk(
  "/cart/updateCartItems",
  async ({ userId, productId, quantity }: UpdateCartParams) => {
    const response = await axios.put(
      "http://localhost:5000/api/shop/cart/update-cart",
      { userId, productId, quantity }
    );
    return response.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "/cart/deleteCartItems",
  async ({ userId, productId }: DeleteCartParams) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/${userId}/${productId}`
    );
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = null;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = null;
      })
      .addCase(updateCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = null;
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = null;
      });
  },
});

export default shoppingCartSlice.reducer;

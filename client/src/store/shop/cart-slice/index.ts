import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import { debounce } from 'lodash-es';
import { Cart, CartState, LocalCartItem } from "./cart.types";

// Constants
const STORAGE_KEY = 'cart_v2';

// ===== Local Storage Helpers =====
const loadLocalCart = (): LocalCartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load local cart:', error);
    return [];
  }
};

const saveLocalCart = (items: LocalCartItem[]) => {
  try {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

// ===== Initial State =====
const initialState: CartState = {
  serverCart: null,
  localCart: loadLocalCart(),
  loading: {
    fetch: false,
    update: false,
    merge: false,
  },
  error: null,
  isLoggedIn: false,
  itemOperations: {},
  hasFetchedServerCart: false,
};

// ===== Async Thunks =====
export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/shop/cart");
      return res.data.data || res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk<
  Cart,
  { productId: string; quantity: number },
  { rejectValue: string }
>(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/shop/cart/add", { productId, quantity });
      return res.data.data || res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add cart");
    }
  }
);

export const updateCartItem = createAsyncThunk<
  Cart,
  { productId: string; quantity: number },
  { rejectValue: string; }
>(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/shop/cart/update", { productId, quantity });
      return res.data.data || res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeFromCart = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string; }
>(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/shop/cart/remove/${productId}`);
      return res.data.data || res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

export const clearCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/shop/cart/clear");
      return res.data.data || res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

export const mergeCart = createAsyncThunk<
  { cart: Cart; warnings?: { productId: string; reason: string }[] },
  LocalCartItem[],
  { rejectValue: string }
>(
  "cart/mergeCart",
  async (localCartItems, { rejectWithValue }) => {
    try {
      // Transform to BE expected format
      const transformedItems = localCartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const res = await axiosInstance.post("/shop/cart/merge", {
        localCartItems: transformedItems
      });

      // Handle different response formats
      if (res.data.data) {
        return {
          cart: res.data.data,
          warnings: res.data.warnings
        };
      }
      return { cart: res.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to merge cart");
    }
  }
);

// ===== Slice =====
const cartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      const wasLoggedIn = state.isLoggedIn;
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        state.serverCart = null;
        state.hasFetchedServerCart = false;
      }
      else if (!wasLoggedIn) {
        // User just logged in
        state.hasFetchedServerCart = false; // Reset to trigger fresh fetch
      }
    },

    setHasFetchedServerCart: (state, action: PayloadAction<boolean>) => {
      state.hasFetchedServerCart = action.payload;
    },

    addToLocalCart: (state, action: PayloadAction<{
      productId: string;
      quantity: number;
      product: LocalCartItem['product'];
    }>) => {
      const { productId, quantity, product } = action.payload;

      const existing = state.localCart.find(item => item.productId === productId);

      if (existing) {
        // existing.quantity += quantity;
        const newQuantity = existing.quantity + quantity;
        existing.quantity = Math.min(newQuantity, product.totalStock);
        existing.addedAt = Date.now();
      } else {
        state.localCart.push({
          productId,
          quantity: Math.min(quantity, product.totalStock),
          product,
          addedAt: Date.now()
        });
      }

      saveLocalCart(state.localCart);
    },

    updateLocalCartItem: (state, action: PayloadAction<{
      productId: string;
      quantity: number
    }>) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.localCart = state.localCart.filter(item => item.productId !== productId);
      } else {
        const item = state.localCart.find(item => item.productId === productId);
        if (item) {
          item.quantity = Math.min(quantity, item.product.totalStock);
          item.addedAt = Date.now();
        }
      }

      saveLocalCart(state.localCart);
    },

    removeFromLocalCart: (state, action: PayloadAction<string>) => {
      state.localCart = state.localCart.filter(item => item.productId !== action.payload);
      saveLocalCart(state.localCart);
    },

    clearLocalCart: (state) => {
      state.localCart = [];
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.serverCart = action.payload;
        state.hasFetchedServerCart = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // addToCart
      .addCase(addToCart.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.itemOperations[productId] = 'adding';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.itemOperations[productId];
        state.serverCart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.itemOperations[productId];
        state.error = action.payload || "Failed to add item";
      })

      // updateCartItem
      .addCase(updateCartItem.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.itemOperations[productId] = 'updating';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.itemOperations[productId];
        state.serverCart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        delete state.itemOperations[productId];
        state.error = action.payload || "Failed to update item";
      })

      // removeFromCart
      .addCase(removeFromCart.pending, (state, action) => {
        const productId = action.meta.arg;
        state.itemOperations[productId] = 'removing';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        delete state.itemOperations[productId];
        state.serverCart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const productId = action.meta.arg;
        delete state.itemOperations[productId];
        state.error = action.payload || "Failed to remove item";
      })

      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading.update = false;
        state.serverCart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload || "Failed to clear cart";
      })

      // mergeCart
      .addCase(mergeCart.pending, (state) => {
        state.loading.merge = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading.merge = false;
        state.serverCart = action.payload.cart;
        state.hasFetchedServerCart = true;

        // Clear local cart after successful merge
        state.localCart = [];
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        // Handle warnings if any
        if (action.payload.warnings?.length) {
          console.warn('Cart merge warnings:', action.payload.warnings);
        }
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading.merge = false;
        state.error = action.payload || "Failed to merge cart";
      });
  },
});

export const {
  setLoggedIn,
  addToLocalCart,
  updateLocalCartItem,
  removeFromLocalCart,
  clearLocalCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;

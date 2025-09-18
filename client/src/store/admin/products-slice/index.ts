import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductFormState, ProductState } from "./product.types";


const initialState: ProductState = {
  products: [],
  totalPages: 0,
  totalItems: 0,
  selectedProduct: null,
  loading: false,
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (
    query: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products", {
        params: query,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm");
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/add",
  async (newProduct: ProductFormState, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/products/create",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.createdProduct as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi tạo sản phẩm");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, updatedData }: { id: string; updatedData: ProductFormState }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/products/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.updatedProduct as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
      return res.data.product as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy chi tiết sản phẩm");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (
    payload: { id: string; deletedImages: string[] },
    { rejectWithValue }
  ) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/products/${payload.id}/delete`,
        { deletedImages: payload.deletedImages }
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi xoá sản phẩm");
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "product/toggleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/products/${id}/toggle`);
      return res.data.product as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi thay đổi trạng thái sản phẩm");
    }
  }
);

export const toggleFlashSaleStatus = createAsyncThunk(
  "product/toggleFlashSaleStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/products/${id}/toggleFlashSale`);
      return res.data.productFlashSale as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi thay đổi trạng thái sản phẩm");
    }
  }
);

const productSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(toggleFlashSaleStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(toggleFlashSaleStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

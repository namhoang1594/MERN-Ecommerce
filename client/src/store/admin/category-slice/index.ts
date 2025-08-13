import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, ICategoryPayload } from "./category.types";

export interface AdminCategoryState {
    isLoading: boolean;
    categoryList: Category[];
    openModal: boolean;
    isEdit: boolean;
    currentCategory: Category | null;
}

const initialState: AdminCategoryState = {
    isLoading: false,
    categoryList: [],
    openModal: false,
    isEdit: false,
    currentCategory: null,
};

// ✅ Fetch all category
export const fetchAllCategory = createAsyncThunk<Category[]>(
    "/categories/fetchAllCategory",
    async () => {
        const result = await axios.get("http://localhost:5000/api/admin/categories");
        return result?.data?.data;
    }
);

// ✅ Create new category
export const createCategory = createAsyncThunk<Category, ICategoryPayload>(
    "/categories/createCategory",
    async (data) => {
        const result = await axios.post("http://localhost:5000/api/admin/categories/create",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return result?.data?.data;
    }
);

// ✅ Delete category
export const deleteCategory = createAsyncThunk<void, string>(
    "/categories/deleteCategory",
    async (categoryId) => {
        const result = await axios.delete(`http://localhost:5000/api/admin/categories/${categoryId}`);
        return result?.data;
    }
);

// ✅ Update category
export const updateCategory = createAsyncThunk<Category, { id: string; data: ICategoryPayload }>(
    "/categories/updateCategory",
    async ({ id, data }) => {
        const result = await axios.put(
            `http://localhost:5000/api/admin/categories/${id}`,
            data
        );
        return result?.data?.data;
    }
);

const adminCategorySlice = createSlice({
    name: "adminCategory",
    initialState,
    reducers: {
        setOpenModal: (state, action: PayloadAction<boolean>) => {
            state.openModal = action.payload;
        },
        setIsEdit: (state, action: PayloadAction<boolean>) => {
            state.isEdit = action.payload;
        },
        setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
            state.currentCategory = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCategory.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.isLoading = false;
                state.categoryList = action.payload;
            })
            .addCase(fetchAllCategory.rejected, (state) => {
                state.isLoading = false;
                state.categoryList = [];
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                const deletedId = action.meta.arg;
                state.categoryList = state.categoryList.filter((category) => category._id !== deletedId);
            });;
    },
});

export const { setOpenModal, setIsEdit, setCurrentCategory } = adminCategorySlice.actions;
export default adminCategorySlice.reducer;

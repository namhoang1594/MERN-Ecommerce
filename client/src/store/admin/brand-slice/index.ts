import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Brand, IBrandPayload } from "./brand.types";


export interface AdminBrandState {
    isLoading: boolean;
    brandList: Brand[];
    openModal: boolean;
    isEdit: boolean;
    currentBrand: Brand | null;
}

const initialState: AdminBrandState = {
    isLoading: false,
    brandList: [],
    openModal: false,
    isEdit: false,
    currentBrand: null,
};

// ✅ Fetch all brands
export const fetchAllBrands = createAsyncThunk<Brand[]>(
    "/brands/fetchAllBrands",
    async () => {
        const result = await axios.get("http://localhost:5000/api/admin/brands");
        return result?.data?.data;
    }
);

// ✅ Create new brand
export const createBrand = createAsyncThunk<Brand, IBrandPayload>(
    "/brands/createBrand",
    async (data) => {
        const result = await axios.post("http://localhost:5000/api/admin/brands/create", data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return result?.data?.data;
    }
);

// ✅ Delete brand
export const deleteBrand = createAsyncThunk<void, string>(
    "/brands/deleteBrand",
    async (brandId) => {
        const result = await axios.delete(`http://localhost:5000/api/admin/brands/${brandId}`);
        return result?.data;
    }
);

// ✅ Update brand
export const updateBrand = createAsyncThunk<Brand, { id: string; data: IBrandPayload }>(
    "/brands/updateBrand",
    async ({ id, data }) => {
        const result = await axios.put(
            `http://localhost:5000/api/admin/brands/${id}`,
            data
        );
        return result?.data?.data;
    }
);

const adminBrandSlice = createSlice({
    name: "adminBrands",
    initialState,
    reducers: {
        setOpenModal: (state, action: PayloadAction<boolean>) => {
            state.openModal = action.payload;
        },
        setIsEdit: (state, action: PayloadAction<boolean>) => {
            state.isEdit = action.payload;
        },
        setCurrentBrand: (state, action: PayloadAction<Brand | null>) => {
            state.currentBrand = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllBrands.fulfilled, (state, action: PayloadAction<Brand[]>) => {
                state.isLoading = false;
                state.brandList = action.payload;
            })
            .addCase(fetchAllBrands.rejected, (state) => {
                state.isLoading = false;
                state.brandList = [];
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                const deletedId = action.meta.arg;
                state.brandList = state.brandList.filter((brand) => brand._id !== deletedId);
            });;
    },
});

export const { setOpenModal, setIsEdit, setCurrentBrand } = adminBrandSlice.actions;
export default adminBrandSlice.reducer;

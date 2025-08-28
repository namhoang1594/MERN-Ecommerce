import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./auth.types";
import axiosInstance from "@/lib/axios";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// ✅ Auth API calls - inline trong async thunks
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/register", { name, email, password });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      return res.data; // { accessToken, user }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/refresh");
      return res.data; // { accessToken }
    } catch (err: any) {
      return rejectWithValue("Unable to refresh token");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return true;
    } catch (err: any) {
      return rejectWithValue("Logout failed");
    }
  }
);

// export const getProfile = createAsyncThunk(
//   "auth/getProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/auth/profile");
//       return res.data; // { user }
//     } catch (err: any) {
//       return rejectWithValue("Failed to fetch profile");
//     }
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.loading = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Clear auth state on refresh failure
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })
      // // Get profile cases
      // .addCase(getProfile.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      // })
      // .addCase(getProfile.rejected, (state) => {
      //   // If profile fetch fails, user might be invalid
      //   state.user = null;
      //   state.accessToken = null;
      // })
      ;
  },
});

export const { clearAuthState, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
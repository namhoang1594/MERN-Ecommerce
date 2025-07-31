// SettingManager/settingSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ILogo, ISocialLink, ISettingInfo, ISettingState } from "./setting.types";

// Fetch full setting
export const fetchSetting = createAsyncThunk("setting/fetch", async () => {
    const res = await axios.get("http://localhost:5000/api/admin/site-setting/get");
    return res.data;
});

// --- LOGO ---
export const uploadLogo = createAsyncThunk("setting/uploadLogo", async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post("http://localhost:5000/api/admin/site-setting/logos", formData);
    return res.data;
});

export const deleteLogo = createAsyncThunk("setting/deleteLogo", async (public_id: string) => {
    const res = await axios.delete(`http://localhost:5000/api/admin/site-setting/logos/${encodeURIComponent(public_id)}`);
    return res.data;
});

export const toggleLogo = createAsyncThunk(
    "setting/toggleLogo",
    async (public_id: string) => {
        const res = await axios.put(`http://localhost:5000/api/admin/site-setting/logos/${public_id}/toggle`,
            { public_id }
        );
        return res.data;
    });

// --- SOCIAL LINKS ---
export const updateSocialLinks = createAsyncThunk("setting/updateSocialLinks", async (links: ISocialLink[]) => {
    const res = await axios.patch("http://localhost:5000/api/admin/site-setting/social-links", { socialLinks: links });
    return res.data; // updated socialLinks
});

// --- INFO (Hotline, Email, etc) ---
export const updateInfo = createAsyncThunk("setting/updateInfo", async (info: ISettingInfo) => {
    const res = await axios.patch("http://localhost:5000/api/admin/site-setting/info", info);
    return res.data; // updated info
});

// --- Slice ---
const initialState: ISettingState = {
    logos: [],
    socialLinks: [],
    info: {
        hotline: "",
        email: "",
        slogan: "",
        footerText: "",
    },
    loading: false,
};

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSetting.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSetting.fulfilled, (state, action) => {
                state.loading = false;
                state.logos = action.payload.logos;
                state.socialLinks = action.payload.socialLinks;
                state.info = {
                    hotline: action.payload.hotline || "",
                    email: action.payload.email || "",
                    slogan: action.payload.slogan || "",
                    footerText: action.payload.footerText || "",
                };
            })

            // Logo handlers
            .addCase(uploadLogo.fulfilled, (state, action) => {
                state.logos = action.payload;
            })
            .addCase(deleteLogo.fulfilled, (state, action) => {
                state.logos = action.payload;
            })
            .addCase(toggleLogo.fulfilled, (state, action) => {
                state.logos = action.payload;
            })

            // Social Links
            .addCase(updateSocialLinks.fulfilled, (state, action) => {
                state.socialLinks = action.payload;
            })

            // Info update
            .addCase(updateInfo.fulfilled, (state, action) => {
                state.info = action.payload;
            });
    },
});

export default settingSlice.reducer;

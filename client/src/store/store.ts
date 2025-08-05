import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminDashboardSlice from "./admin/dashboard-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminCategorySlice from "./admin/category-slice";
import adminBrandSlice from "./admin/brand-slice";
import adminBannerSlice from "./admin/site-setting/banner-slice";
import adminSettingSlice from "./admin/site-setting/setting-slice";


import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchProductSlice from "./shop/search-slice";
import shopReviewProductSlice from "./shop/review-product-slice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    adminDashboard: adminDashboardSlice,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminBanner: adminBannerSlice,
    adminSetting: adminSettingSlice,
    adminCategory: adminCategorySlice,
    adminBrand: adminBrandSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearchProduct: shopSearchProductSlice,
    shopReviewProduct: shopReviewProductSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

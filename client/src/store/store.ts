import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminDashboardSlice from "./admin/dashboard-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminCategorySlice from "./admin/category-slice";
import adminBrandSlice from "./admin/brand-slice";
import adminBannerSlice from "./admin/site-setting/banner-slice";
import adminSettingSlice from "./admin/site-setting/setting-slice";

import shopBannersSlice from "./shop/home/banner-slice";
import shopCategorySlice from "./shop/home/category-slice";
import shopFlashSaleSlice from "./shop/home/flashSale-slice";
import shopSuggestionProductSlice from "./shop/home/suggestionProduct-slice";
import shopNewArrivalProductSlice from "./shop/home/newArrivalProduct-slice";
import shopAllProductsSlice from "./shop/products-slice/allProducts-slice";
import shopProductDetailsSlice from "./shop/products-slice/allProducts-slice/productDetails";
import shopBrandsSlice from "./shop/products-slice/brand-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchProductSlice from "./shop/search-slice";
import shopReviewProductSlice from "./shop/review-product-slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { setupAxiosInterceptors } from "@/lib/axios-intercepter";


const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'], // CHỈ lưu user info, KHÔNG lưu accessToken
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    adminDashboard: adminDashboardSlice,
    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminBanner: adminBannerSlice,
    adminSetting: adminSettingSlice,
    adminCategory: adminCategorySlice,
    adminBrand: adminBrandSlice,

    shopBanners: shopBannersSlice,
    shopCategory: shopCategorySlice,
    shopFlashSale: shopFlashSaleSlice,
    shopSuggestionProduct: shopSuggestionProductSlice,
    shopNewArrivalProduct: shopNewArrivalProductSlice,
    shopAllProducts: shopAllProductsSlice,
    shopProductDetails: shopProductDetailsSlice,
    shopBrand: shopBrandsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearchProduct: shopSearchProductSlice,
    shopReviewProduct: shopReviewProductSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

setupAxiosInterceptors();


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


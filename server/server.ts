import dotenv from "dotenv";
// Load env
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./src/config/db";


// Import routes
import uploadImageRoutes from "./src/helpers/image-upload.routes";

import authRouter from "./src/routes/auth/auth-routes";
import adminDashboardRouter from "./src/routes/admin/dashboard-routes";
import adminProductsRouter from "./src/routes/admin/products-routes";
import adminOrdersRouter from "./src/routes/admin/order-routes";
import adminCategoryRouter from "./src/routes/admin/category-routes";
import adminBrandRouter from "./src/routes/admin/brand-routes";
import adminUsersRouter from "./src/routes/admin/user-routes";


import shopUserProfileRouter from "./src/routes/shop/user-profile-routes";
import shopCategoryRouter from "./src/routes/shop/category-routes";
import shopBrandRouter from "./src/routes/shop/brand-routes";
import shopProductRouter from "./src/routes/shop/products-routes";
import shopCartRouter from "./src/routes/shop/cart-routes";
import shopCheckoutRouter from "./src/routes/shop/checkout-routes";
import shopOrderRouter from "./src/routes/shop/order-routes";
import shopSearchProductRouter from "./src/routes/shop/search-routes";
import shopReviewProductRouter from "./src/routes/shop/review-product-routes";

import bannerSetting from "./src/routes/site-setting/banner-routes";
import siteSetting from "./src/routes/site-setting/setting-routes";


// Init app
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", uploadImageRoutes);

app.use("/api/auth", authRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/brands", adminBrandRouter);
app.use("/api/admin/users", adminUsersRouter);

app.use("/api/admin/banners", bannerSetting);
app.use("/api/admin/site-setting", siteSetting);

app.use("/api/shop/profile", shopUserProfileRouter);
app.use("/api/shop/categories", shopCategoryRouter);
app.use("/api/shop/brands", shopBrandRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/checkout", shopCheckoutRouter);
app.use("/api/shop/orders", shopOrderRouter);
app.use("/api/shop/reviews", shopReviewProductRouter);
app.use("/api/shop/search", shopSearchProductRouter);



// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
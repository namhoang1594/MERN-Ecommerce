// server/server.ts
import dotenv from "dotenv";
// Load env
dotenv.config();
import type { } from './types/express';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./src/config/db";


// Import routes
import authRouter from "./src/routes/auth/auth-routes";
import adminProductsRouter from "./src/routes/admin/products-routes";
import adminOrdersRouter from "./src/routes/admin/order-routes";
import shopProductRouter from "./src/routes/shop/products-routes";
import shopCartRouter from "./src/routes/shop/cart-routes";
import shopAddressRouter from "./src/routes/shop/address-routes";
import shopOrderRouter from "./src/routes/shop/order-routes";
import shopSearchProductRouter from "./src/routes/shop/search-routes";
import shopReviewProductRouter from "./src/routes/shop/review-product-routes";
import commonFeatureRouter from "./src/routes/common/feature-routes";



// Init app
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchProductRouter);
app.use("/api/shop/review", shopReviewProductRouter);
app.use("/api/common/feature", commonFeatureRouter);

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
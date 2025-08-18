import express from "express";
import { getProductsForShop } from "../../controllers/shop/products-controller";

const router = express.Router();

router.get("/get", getProductsForShop);

export default router;

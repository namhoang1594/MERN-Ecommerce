import express from "express";
import { getProductDetail, getProductsForShop } from "../../controllers/shop/products-controller";

const router = express.Router();

router.get("/get", getProductsForShop);
router.get("/:slugOrId", getProductDetail);

export default router;

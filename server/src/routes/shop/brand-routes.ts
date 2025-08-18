import express from "express";
import { getBrandsForShop } from "../../controllers/shop/brand-controller";

const router = express.Router();

router.get("/get", getBrandsForShop);

export default router;

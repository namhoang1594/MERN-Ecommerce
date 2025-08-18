import express from "express";
import { getCategoriesForShop } from "../../controllers/shop/category-controller";

const router = express.Router();

router.get("/get", getCategoriesForShop);

export default router;

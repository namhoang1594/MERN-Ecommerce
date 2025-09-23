import { Router } from "express";
import { searchProducts } from "../../controllers/shop/search-controller";

const router = Router();

router.get("/", searchProducts);

export default router;

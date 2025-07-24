import { Router } from "express";
import {
  addReviewProduct,
  getReviewProduct,
} from "../../controllers/shop/review-product-controller";

const router = Router();

router.post("/add", addReviewProduct);
router.get("/:productId", getReviewProduct);

export default router;

import { Router } from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview
} from "../../controllers/shop/review-product-controller";
import { verifyToken } from "../../middlewares/auth/auth";


const router = Router();

router.get("/get/:productId", getReviews);
router.post("/add", verifyToken, createReview);
router.put("/edit/:id", verifyToken, updateReview);
router.delete("/delete/:id", verifyToken, deleteReview);

export default router;

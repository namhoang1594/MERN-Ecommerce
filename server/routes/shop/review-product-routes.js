const express = require("express");
const router = express.Router();

const {
  addReviewProduct,
  getReviewProduct,
} = require("../../controllers/shop/review-product-controller");

router.post("/add", addReviewProduct);
router.get("/:productId", getReviewProduct);

module.exports = router;

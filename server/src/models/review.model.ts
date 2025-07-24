import { Schema, model } from "mongoose";
import { IReview } from "../types/reviews.types";

const ProductReviewSchema = new Schema<IReview>(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

const ProductReview = model<IReview>("ProductReview", ProductReviewSchema);

export default ProductReview;
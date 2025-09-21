import { model, Schema } from "mongoose";
import { IReview } from "../types/reviews.types";

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Mỗi user chỉ được review 1 lần / product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const ReviewModel = model<IReview>("Review", reviewSchema);

export default ReviewModel;
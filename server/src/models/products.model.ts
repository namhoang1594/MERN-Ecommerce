import { Schema, model } from "mongoose";
import { IProduct } from "../types/products.types";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    totalStock: { type: Number, required: true },
    image: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    active: { type: Boolean, default: true },
    deletedImages: { type: [String], default: [] },
    isFlashSale: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
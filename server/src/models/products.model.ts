import { Schema, model } from "mongoose";
import { IProduct } from "../types/products.types";
import { removeVietnameseTones } from "../services/shop/search.service";

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    titleWithoutTones: { type: String, trim: true },
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

productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.titleWithoutTones = removeVietnameseTones(this.title);
  }
  next();
});

// Index cho performance
productSchema.index({ title: 'text', titleWithoutTones: 'text' });

const Product = model<IProduct>("Product", productSchema);

export default Product;
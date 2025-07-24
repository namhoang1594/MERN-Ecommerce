import { Schema, model } from "mongoose";
import { IProduct } from "../types/products.types";


const productSchema = new Schema<IProduct>(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;

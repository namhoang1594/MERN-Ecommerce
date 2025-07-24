import Product from "../../models/products.model";
import { IProduct } from "../../types/products.types";

export const createProduct = async (data: IProduct) => {
    const newProduct = new Product(data);
    return await newProduct.save();
};

export const getAllProducts = async () => {
    return await Product.find({});
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
    const product = await Product.findById(id);
    if (!product)
        return null;

    Object.assign(product, data);
    return await product.save();
};

export const deleteProduct = async (id: string) => {
    return await Product.findByIdAndDelete(id);
};

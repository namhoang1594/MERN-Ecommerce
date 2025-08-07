import {
  Product,
  ProductFormState,
} from "@/store/admin/products-slice/product.types";

export const convertToPlainProduct = (
  data: ProductFormState
): Omit<ProductFormState, "_id"> => {
  return {
    title: data.title,
    description: data.description,
    price: data.price,
    salePrice: data.salePrice,
    totalStock: data.totalStock,
    brand: data.brand,
    category: data.category,
    active: data.active,
    image: data.image,
    deletedImages: data.deletedImages,
  };
};

export const convertProductToFormState = (data: Product): ProductFormState => {
  return {
    _id: data._id,
    title: data.title,
    description: data.description ?? "",
    price: data.price,
    salePrice: data.salePrice ?? 0,
    totalStock: data.totalStock,
    brand: data.brand?._id || "",
    category: data.category?._id || "",
    active: data.active,
    image: data.image,
    deletedImages: data.deletedImages,
  };
};

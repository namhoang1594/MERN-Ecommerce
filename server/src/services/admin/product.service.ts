import slugify from "slugify";
import mongoose from "mongoose";
import { IProduct, ProductImage } from "../../types/products.types";
import Product from "../../models/products.model";
import { imageDeleteUtil } from "../../helpers/cloudinary";

export const createProductService = async (data: IProduct) => {
    const slug = slugify(data.title, { lower: true });
    const image = Array.isArray(data.image) ? data.image : [];
    const newProduct = await Product.create({ ...data, image, slug });
    const populated = await Product.findById(newProduct._id)
        .populate("brand")
        .populate("category");
    return populated;
};

export const getProductsService = async (
    page = 1,
    limit = 10,
    search = "",
    category?: string,
    brand?: string,
    status?: string
) => {
    const query: any = {};

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
    }

    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
        query.brand = brand;
    }

    if (status) {
        query.status = status;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate("category", "name")
        .populate("brand", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return { products, total };
};

export const getProductByIdService = async (id: string) => {
    return await Product.findById(id)
        .populate("category", "name")
        .populate("brand", "name");
};

export const updateProductService = async (id: string, data: Partial<IProduct> & { deletedImages?: ProductImage[] }) => {
    const slug = data.title ? slugify(data.title, { lower: true }) : undefined;
    const image = Array.isArray(data.image) ? data.image : undefined;

    if (Array.isArray(data.deletedImages) && data.deletedImages.length > 0) {
        for (const img of data.deletedImages) {
            if (img.public_id) {
                await imageDeleteUtil(img.public_id);
            }
        }
    }

    const updated = await Product.findByIdAndUpdate(
        id,
        {
            ...data,
            ...(slug ? { slug } : {}),
            ...(image ? { image } : {}),
        },
        { new: true }
    );

    if (!updated) return null;

    const populated = await Product.findById(updated._id)
        .populate("brand")
        .populate("category");

    return populated;
};

export const deleteProductService = async (id: string, deletedImages: string[] = []) => {
    const product = await Product.findById(id);
    if (!product) return null;

    const imageList = product.image as ProductImage[];
    if (Array.isArray(imageList)) {
        for (const img of imageList) {
            if (img.public_id) {
                await imageDeleteUtil(img.public_id);
            }
        }
    }
    if (Array.isArray(deletedImages)) {
        for (const publicId of deletedImages) {
            await imageDeleteUtil(publicId);
        }
    }
    return await Product.findByIdAndDelete(id);
};

export const toggleProductStatusService = async (productId: string) => {
    const product = await Product.findById(productId)
        .populate("brand")
        .populate("category");
    if (!product) {
        throw new Error("Product not found");
    }

    product.active = !product.active;
    await product.save();

    const updatedProduct = await Product.findById(productId)
        .populate("brand")
        .populate("category");

    return updatedProduct;
};

export const getFlashSaleForShopService = async () => {
    const products = await Product.find({ isFlashSale: true })
        .sort({ createdAt: -1 })
        .limit(10);
    return products;
};

export const toggleFlashSaleStatusService = async (productId: string) => {
    const product = await Product.findById(productId)
        .populate("brand")
        .populate("category");
    if (!product) {
        throw new Error("Product not found");
    }

    product.isFlashSale = !product.isFlashSale;
    await product.save();

    const updatedFlashSale = await Product.findById(productId)
        .populate("brand")
        .populate("category");

    return updatedFlashSale;
};

export const getSuggestionProductsService = async (limit: number) => {
    const count = await Product.countDocuments();
    const randomSkip = Math.max(0, Math.floor(Math.random() * (count - limit)));
    return Product.find()
        .skip(randomSkip)
        .limit(limit)
};

export const getNewArrivalProductsService = async () => {
    const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(10);
    return products;
};

export const fetchProductsForShop = async (
    page: number = 1,
    limit: number = 20,
    filters: {
        active?: boolean;
        category?: string;
        brand?: string;
    }
) => {
    const skip = (page - 1) * limit;

    const filter: any = { active: true, ...filters };

    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
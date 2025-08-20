import { Types } from "mongoose";
import Product from "../../models/products.model";

export const getProducts = async (query: any) => {
    const {
        search,
        category,
        brand,
        priceMin,
        priceMax,
        sort,
        page = 1,
        limit = 12,
    } = query;

    const filter: any = {};

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
        filter.category = category;
    }

    if (brand) {
        filter.brand = brand;
    }

    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.$lte = Number(priceMax);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case "price_asc":
                sortOption = { price: 1 };
                break;
            case "price_desc":
                sortOption = { price: -1 };
                break;
            case "best_selling":
                sortOption = { sold: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
        }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name slug")
        .populate("brand", "name slug");

    return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    };
};

export const findProductBySlugOrId = async (slugOrId: string) => {
    let product = await Product.findOne({ slug: slugOrId })
        .populate("category")
        .populate("brand");

    if (!product) {
        product = await Product.findById(slugOrId)
            .populate("category")
            .populate("brand");
    }

    return product;
};

export const findRelatedProducts = async (
    categoryId: Types.ObjectId,
    excludeId: Types.ObjectId,
    limit = 6
) => {
    return Product.find({
        category: categoryId,
        _id: { $ne: excludeId },
    })
        .populate("brand")
        .limit(limit);
};
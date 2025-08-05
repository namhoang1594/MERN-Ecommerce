import { Types } from "mongoose";
import { ICategory } from "../../types/category.types";
import Category from "../../models/category.model";
import { imageDeleteUtil, imageUploadUtil } from "../../helpers/cloudinary";

export const createCategoryService = async (categoryData: {
    name: string;
    description?: string;
    image: {
        url: string;
        public_id: string;
    };
}): Promise<ICategory> => {
    const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryData.name}$`, "i") },
    });
    if (existing) throw new Error("Category name already exists");

    const category = await Category.create({
        name: categoryData.name,
        description: categoryData.description,
        image: {
            url: categoryData.image.url,
            public_id: categoryData.image.public_id,
        },
    });

    return category;
};

export const getAllCategoryService = async (query: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    const { page = 1, limit = 10, search = "" } = query;

    const filter = search
        ? {
            name: { $regex: search, $options: "i" },
        }
        : {};

    const [category, total] = await Promise.all([
        Category.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Category.countDocuments(filter),
    ]);

    return {
        data: category,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    };
};

export const getCategoryByIdService = async (id: string): Promise<ICategory | null> => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid category ID");
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");
    return category;
};

export const updateCategoryService = async (
    id: string,
    updatedData: {
        name?: string;
        description?: string;
    },
    fileBuffer?: Buffer
): Promise<ICategory> => {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    if (updatedData.name && updatedData.name !== category.name) {
        const exist = await Category.findOne({
            name: { $regex: new RegExp(`^${updatedData.name}$`, "i") },
            _id: { $ne: id },
        });
        if (exist) throw new Error("Category name already exists");
        category.name = updatedData.name;
    }

    if (fileBuffer) {
        // Delete old image
        await imageDeleteUtil(category.image.public_id);

        // Upload new one
        const result = await imageUploadUtil(fileBuffer, "categories");
        category.image = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    await category.save();
    return category;
};

export const deleteCategoryService = async (id: string) => {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    await imageDeleteUtil(category.image.public_id);
    await Category.findByIdAndDelete(id);
};

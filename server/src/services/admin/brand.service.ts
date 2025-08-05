import { Types } from "mongoose";
import { IBrand } from "../../types/brand.types";
import Brand from "../../models/brand.model";
import { imageDeleteUtil, imageUploadUtil } from "../../helpers/cloudinary";

export const createBrandService = async (brandData: {
    name: string;
    description?: string;
    image: {
        url: string;
        public_id: string;
    };
}): Promise<IBrand> => {
    const existing = await Brand.findOne({
        name: { $regex: new RegExp(`^${brandData.name}$`, "i") },
    });
    if (existing) throw new Error("Brand name already exists");

    const brand = await Brand.create({
        name: brandData.name,
        description: brandData.description,
        image: {
            url: brandData.image.url,
            public_id: brandData.image.public_id,
        },
    });

    return brand;
};

export const getAllBrandsService = async (query: {
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

    const [brands, total] = await Promise.all([
        Brand.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Brand.countDocuments(filter),
    ]);

    return {
        data: brands,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    };
};

export const getBrandByIdService = async (id: string): Promise<IBrand | null> => {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid brand ID");
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found");
    return brand;
};

export const updateBrandService = async (
    id: string,
    updatedData: {
        name?: string;
        description?: string;
    },
    fileBuffer?: Buffer
): Promise<IBrand> => {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found");

    if (updatedData.name && updatedData.name !== brand.name) {
        const exist = await Brand.findOne({
            name: { $regex: new RegExp(`^${updatedData.name}$`, "i") },
            _id: { $ne: id },
        });
        if (exist) throw new Error("Brand name already exists");
        brand.name = updatedData.name;
    }

    if (updatedData.description !== undefined) {
        brand.description = updatedData.description;
    }

    if (fileBuffer) {
        // Delete old image
        await imageDeleteUtil(brand.image.public_id);

        // Upload new one
        const result = await imageUploadUtil(fileBuffer, "brands");
        brand.image = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    await brand.save();
    return brand;
};

export const deleteBrandService = async (id: string) => {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found");

    await imageDeleteUtil(brand.image.public_id);
    await Brand.findByIdAndDelete(id);
};

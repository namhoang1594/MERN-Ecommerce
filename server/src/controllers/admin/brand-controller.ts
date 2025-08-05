import { Request, Response } from "express";
import {
    createBrandService,
    deleteBrandService,
    getAllBrandsService,
    getBrandByIdService,
    updateBrandService
} from "../../services/admin/brand.service";


export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !image?.url || !image?.public_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const brand = await createBrandService({
            name,
            description,
            image,
        });

        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export const getAllBrands = async (req: Request, res: Response) => {
    try {
        const { page, limit, search } = req.query;

        const brands = await getAllBrandsService({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search: (search as string) || "",
        });

        res.json({ success: true, ...brands });
    } catch (error) {
        res
            .status(500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
};

export const getBrandById = async (req: Request, res: Response) => {
    try {
        const brand = await getBrandByIdService(req.params.id);
        res.json({ success: true, data: brand });
    } catch (error) {
        res
            .status(404)
            .json({ message: error instanceof Error ? error.message : "Not found" });
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        const updatedBrand = await updateBrandService(
            req.params.id,
            { name, description },
            req.file?.buffer
        );

        res.json({ success: true, data: updatedBrand });
    } catch (error) {
        res
            .status(500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        await deleteBrandService(req.params.id);
        res.json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        res
            .status(404)
            .json({ message: error instanceof Error ? error.message : "Not found" });
    }
};

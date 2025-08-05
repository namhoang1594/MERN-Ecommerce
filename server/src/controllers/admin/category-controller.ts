import { Request, Response } from "express";
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoryService,
    getCategoryByIdService,
    updateCategoryService
} from "../../services/admin/category.service";



export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !image?.url || !image?.public_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const brand = await createCategoryService({
            name,
            image,
        });

        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const { page, limit, search } = req.query;

        const brands = await getAllCategoryService({
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

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await getCategoryByIdService(req.params.id);
        res.json({ success: true, data: category });
    } catch (error) {
        res
            .status(404)
            .json({ message: error instanceof Error ? error.message : "Not found" });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const updatedCategory = await updateCategoryService(
            req.params.id,
            { name },
            req.file?.buffer
        );

        res.json({ success: true, data: updatedCategory });
    } catch (error) {
        res
            .status(500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await deleteCategoryService(req.params.id);
        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res
            .status(404)
            .json({ message: error instanceof Error ? error.message : "Not found" });
    }
};

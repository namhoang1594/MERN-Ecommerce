import { Request, Response } from "express";
import Category from "../../models/category.model";

export const getCategoriesForShop = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find()
            .select("_id name slug image")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

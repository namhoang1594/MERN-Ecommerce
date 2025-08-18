import { Request, Response } from "express";
import Brand from "../../models/brand.model";

export const getBrandsForShop = async (req: Request, res: Response) => {
    try {
        const brands = await Brand.find()
            .select("_id name slug image")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: brands,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

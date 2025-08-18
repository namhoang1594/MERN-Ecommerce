import { Request, Response } from "express";
import { getProducts } from "../../services/shop/products.service";

export const getProductsForShop = async (req: Request, res: Response) => {
    try {
        const { products, total, page, totalPages } = await getProducts(req.query);

        return res.status(200).json({
            products,
            total,
            page,
            totalPages,
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

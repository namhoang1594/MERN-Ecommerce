import { Request, Response } from "express";
import { findProductBySlugOrId, findRelatedProducts, getProducts } from "../../services/shop/products.service";

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

export const getProductDetail = async (req: Request, res: Response) => {
    try {
        const { slugOrId } = req.params;

        const product = await findProductBySlugOrId(slugOrId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const relatedProducts = await findRelatedProducts(
            product.category._id,
            product._id
        );

        return res.json({
            product,
            relatedProducts,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
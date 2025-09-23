import { Request, Response } from "express";
import { searchProductsService } from "../../services/shop/search.service";

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query is required" });
    }

    const products = await searchProductsService(query);

    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

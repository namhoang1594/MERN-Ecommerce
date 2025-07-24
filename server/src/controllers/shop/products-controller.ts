import { Request, Response } from "express";
import {
  getFilteredProductsService,
  getProductDetailsService
} from "../../services/shop/products.service";

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {

    const category = (req.query.category as string)?.split(",") || [];
    const brand = (req.query.brand as string)?.split(",") || [];
    const sortBy = (req.query.sortBy as string) || "price-lowtohigh";

    const products = await getFilteredProductsService({
      category,
      brand,
      sortBy,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!"
    });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductDetailsService(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!"
    });
  }
};

import { Request, Response } from "express";
import { searchProductsByKeyword } from "../../services/shop/search.service";

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Từ khóa tìm kiếm không hợp lệ!",
      });
    }

    const searchResult = await searchProductsByKeyword(keyword);

    res.status(200).json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

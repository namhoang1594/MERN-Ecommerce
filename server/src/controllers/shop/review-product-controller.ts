import { Request, Response } from "express";
import {
  addProductReviewService,
  getProductReviewsService
} from "../../services/shop/review-products.service";
import { IReview } from "../../types/reviews.types";

export const addReviewProduct = async (req: Request, res: Response) => {
  try {
    const reviewData: IReview = req.body;
    const newReview = await addProductReviewService(reviewData);

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

export const getReviewProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await getProductReviewsService(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};
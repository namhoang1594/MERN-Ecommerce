import { Request, Response } from "express";
import { createReviewService, deleteReviewService, getReviewsByProductService, updateReviewService } from "../../services/shop/review-products.service";

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await getReviewsByProductService(
      productId,
      Number(page),
      Number(limit)
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user!._id;

    if (!productId || !rating) {
      return res.status(400).json({ message: "ProductId and rating are required" });
    }

    const review = await createReviewService(productId, userId, rating, comment);
    res.status(201).json(review);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!._id;

    const review = await updateReviewService(id, userId, rating, comment);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const review = await deleteReviewService(id, userId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({
      message: "Review deleted",
      deletedReview: { _id: id }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

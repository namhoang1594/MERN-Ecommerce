import { Types } from "mongoose";
import { IReview } from "../../types/reviews.types";
import ReviewModel from "../../models/review.model";
import Product from "../../models/products.model";

export const getReviewsByProductService = async (productId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
        ReviewModel.find({ product: productId })
            .populate("user", "name avatar.url")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ReviewModel.countDocuments({ product: productId }),
    ]);

    return { reviews, total };
};

export const createReviewService = async (
    productId: string,
    userId: string,
    rating: number,
    comment?: string
): Promise<IReview> => {
    const review = await ReviewModel.create({
        product: new Types.ObjectId(productId),
        user: new Types.ObjectId(userId),
        rating,
        comment,
    });

    await updateProductStats(productId);
    return review;
};

export const updateReviewService = async (
    reviewId: string,
    userId: string,
    rating: number,
    comment?: string
) => {
    const review = await ReviewModel.findOneAndUpdate(
        { _id: reviewId, user: userId },
        { rating, comment },
        { new: true }
    );

    if (review) {
        await updateProductStats(review.product.toString());
    }
    return review;
};

export const deleteReviewService = async (reviewId: string, userId: string) => {
    const review = await ReviewModel.findOneAndDelete({ _id: reviewId, user: userId });
    if (review) {
        await updateProductStats(review.product.toString());
    }
    return review;
};

const updateProductStats = async (productId: string) => {
    const stats = await ReviewModel.aggregate([
        { $match: { product: new Types.ObjectId(productId) } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            averageRating: stats[0].avgRating,
            totalReviews: stats[0].totalReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            totalReviews: 0,
        });
    }

    // const updateData = stats ? {
    //     averageRating: Math.round(stats.avgRating * 10) / 10, // Round to 1 decimal
    //     totalReviews: stats.totalReviews,
    // } : {
    //     averageRating: 0,
    //     totalReviews: 0,
    // };

    // await Product.findByIdAndUpdate(productId, updateData);
};

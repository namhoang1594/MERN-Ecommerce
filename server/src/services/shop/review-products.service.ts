import ProductReview from "../../models/review.model";
import Order from "../../models/orders.model";
import Product from "../../models/products.model";
import { IReview } from "../../types/reviews.types";

export const addProductReviewService = async (reviewData: IReview): Promise<IReview> => {
    const { productId, userId, userName, reviewMessage, reviewValue } = reviewData;

    const order = await Order.findOne({
        userId,
        "cartItems.productId": productId,
    });

    if (!order) {
        throw new Error("Bạn cần mua sản phẩm này để đánh giá!");
    }

    const existingReview = await ProductReview.findOne({ productId, userId });

    if (existingReview) {
        throw new Error("Bạn đã đánh giá sản phẩm này rồi! Vui lòng không đánh giá lại.");
    }

    const newReview = new ProductReview({
        productId,
        userId,
        userName,
        reviewMessage,
        reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewLength = reviews.length;
    const averageReview =
        reviews.reduce((sum, item) => sum + item.reviewValue, 0) / totalReviewLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return newReview;
};

export const getProductReviewsService = async (productId: string) => {
    return await ProductReview.find({ productId });
};
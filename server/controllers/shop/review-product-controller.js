const Order = require("../../models/orders");
const ProductsReview = require("../../models/review");
const Product = require("../../models/products");

const addReviewProduct = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it!",
      });
    }

    const checkExistinReview = await ProductsReview.findOne({
      productId,
      userId,
    });

    if (!checkExistinReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductsReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductsReview.find({ productId });

    const totalReviewLength = reviews.length;

    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductsReview.find({ productId });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addReviewProduct, getReviewProduct };

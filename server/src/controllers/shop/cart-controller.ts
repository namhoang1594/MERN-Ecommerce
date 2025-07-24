import { Request, Response } from "express";
import {
  addItemToCart,
  deleteCartItem,
  getCartWithProducts,
  updateCartItemQuantity,
} from "../../services/shop/cart.service";
import { PopulatedCartItem } from "../../types/cart.types";
import { IProductWithId } from "../../types/products.types";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    console.log("REQ BODY:", req.body);

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ!",
      });
    }

    await addItemToCart(userId, productId, quantity);
    const cart = await getCartWithProducts(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const validCartItems = cart.items.filter(
      (item): item is PopulatedCartItem =>
        !!item.productId &&
        typeof item.productId === "object" &&
        "title" in item.productId
    );

    if (validCartItems.length < cart.items.length) {
      cart.items = validCartItems;
      await cart.save();
    }

    const populatedItems = validCartItems.map(({ productId, quantity }) => {
      const product = productId as IProductWithId;
      return {
        productId: product._id,
        image: product.image,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
      error: (error as Error).message,
    });
  }
};

export const fetchCartItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await getCartWithProducts(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const validCartItems = cart.items.filter(
      (item): item is PopulatedCartItem =>
        !!item.productId &&
        typeof item.productId === "object" &&
        "title" in item.productId
    );

    if (validCartItems.length < cart.items.length) {
      cart.items = validCartItems;
      await cart.save();
    }

    const populatedItems = validCartItems.map(({ productId, quantity }) => {
      const product = productId as IProductWithId;
      return {
        productId: product._id,
        image: product.image,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ!",
      });
    }

    await updateCartItemQuantity(userId, productId, quantity);
    const cart = await getCartWithProducts(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const validCartItems = cart.items.filter(
      (item): item is PopulatedCartItem =>
        !!item.productId &&
        typeof item.productId === "object" &&
        "title" in item.productId
    );

    if (validCartItems.length < cart.items.length) {
      cart.items = validCartItems;
      await cart.save();
    }

    const populatedItems = validCartItems.map(({ productId, quantity }) => {
      const product = productId as IProductWithId;
      return {
        productId: product._id,
        image: product.image,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  }
};

export const deleteCartItemById = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId hoặc productId",
      });
    }

    await deleteCartItem(userId, productId);
    const cart = await getCartWithProducts(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    const validCartItems = cart.items.filter(
      (item): item is PopulatedCartItem =>
        !!item.productId &&
        typeof item.productId === "object" &&
        "title" in item.productId
    );

    if (validCartItems.length < cart.items.length) {
      cart.items = validCartItems;
      await cart.save();
    }

    const populatedItems = validCartItems.map(({ productId, quantity }) => {
      const product = productId as IProductWithId;
      return {
        productId: product._id,
        image: product.image,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau!",
    });
  }
};

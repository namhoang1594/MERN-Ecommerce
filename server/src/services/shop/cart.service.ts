import { Types } from "mongoose";
import Cart from "../../models/cart.model";
import Product from "../../models/products.model";
import { CartDocument } from "../../types/cart.types";

const getPopulatedCart = async (userId: string) => {
    return await Cart.findOne({ userId })
        .populate("items.productId", "image title price salePrice")
};

export const findOrCreateCart = async (userId: string): Promise<CartDocument> => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
    }
    return cart;
};

export const addItemToCart = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
    }

    const cart = await findOrCreateCart(userId);
    const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    if (index === -1) {
        cart.items.push({
            productId: new Types.ObjectId(productId),
            quantity,
        });
    } else {
        cart.items[index].quantity += quantity;
    }

    await cart.save();
    const populatedCart = await getCartWithProducts(userId);
    return populatedCart?.toObject();
};

export const getCartWithProducts = async (userId: string) => {
    return await getPopulatedCart(userId);
};

export const updateCartItemQuantity = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error("Không tìm thấy giỏ hàng");
    }

    const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );
    if (index === -1) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    cart.items[index].quantity = quantity;
    await cart.save();
    const populatedCart = await getCartWithProducts(userId);
    return populatedCart?.toObject();
};

export const deleteCartItem = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error("Không tìm thấy giỏ hàng");
    }

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );
    await cart.save();
    const populatedCart = await getCartWithProducts(userId);
    return populatedCart?.toObject();
};

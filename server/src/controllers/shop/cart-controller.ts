import { Request, Response } from "express";
import { addToCartService, clearCartService, getCartService, mergeCartService, removeFromCartService, updateCartItemService } from "../../services/shop/cart.service";

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const cart = await getCartService(userId);
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid input" });
        }
        const cart = await addToCartService(userId, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { productId, quantity } = req.body;
        const cart = await updateCartItemService(userId, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { productId } = req.params;
        const cart = await removeFromCartService(userId, productId);
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const cart = await clearCartService(userId);
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        const status = err.message.includes("not found") ? 404 : 500;
        res.status(status).json({ message: err.message });
    }
};

export const mergeCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { localCartItems } = req.body;

        // Validate input
        if (!Array.isArray(localCartItems)) {
            return res.status(400).json({
                message: "localCartItems must be an array"
            });
        }

        // Validate each item structure
        for (const item of localCartItems) {
            if (!item.productId || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    message: "Invalid cart item format"
                });
            }
        }

        const { cart, warnings } = await mergeCartService(userId, localCartItems);

        res.status(200).json({
            success: true,
            message: "Cart merged successfully",
            data: cart,
            warnings
        });

    } catch (err: any) {
        console.error("Merge cart error:", err);
        const status = err.message.includes("not available") ? 400 : 500;
        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};
import { Types } from "mongoose";
import CartModel from "../../models/cart.model";
import Product from "../../models/products.model";
import { ICart, ICartItem } from "../../types/cart.types";
import { getProductsMapWithSession, withTransaction } from "../../helpers/cart/transaction";

interface MergeCartResult {
    cart: ICart | null;
    warnings: { productId: string; reason: string }[];
}

export const getCartService = async (userId: string) => {
    let cart = await CartModel.findOne({ userId }).populate("items.productId");
    if (!cart) {
        cart = new CartModel({ userId, items: [] });
        await cart.save();
        cart = await CartModel.findOne({ userId }).populate("items.productId");
    }
    return cart;
};

export const addToCartService = async (userId: string, productId: string, quantity: number) => {
    return withTransaction(async (session) => {
        // Validate input
        if (quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }

        const productsMap = await getProductsMapWithSession([productId], session);
        // Check product exists and get stock
        const product = productsMap.get(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        let cart = await CartModel.findOne({ userId }).session(session);
        if (!cart) {
            cart = new CartModel({ userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.totalStock) {
                throw new Error(`Only ${product.totalStock} items available. Current in cart: ${existingItem.quantity}`);
            }
            existingItem.quantity = newQuantity;
        } else {
            if (quantity > product.totalStock) {
                throw new Error(`Only ${product.totalStock} items available`);
            }
            cart.items.push({
                productId: new Types.ObjectId(productId),
                quantity
            });
        }

        await cart.save({ session });
        await cart.populate({
            path: "items.productId",
            options: { session }
        });
        return cart;
    });
};

export const updateCartItemService = async (userId: string, productId: string, quantity: number) => {
    return withTransaction(async (session) => {
        if (quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }

        const productsMap = await getProductsMapWithSession([productId], session);
        const product = productsMap.get(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (quantity > product.totalStock) {
            throw new Error(`Only ${product.totalStock} items available`);
        }

        const cart = await CartModel.findOne({ userId }).session(session);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const item = cart.items.find((i) => i.productId.toString() === productId);
        if (!item) {
            throw new Error("Item not found in cart");
        }

        item.quantity = quantity;
        await cart.save({ session });

        await cart.populate({
            path: "items.productId",
            options: { session }
        });
        return cart;
    });
};

export const removeFromCartService = async (userId: string, productId: string) => {
    return withTransaction(async (session) => {
        const cart = await CartModel.findOne({ userId }).session(session);
        if (!cart) throw new Error("Cart not found");

        cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
        await cart.save({ session });
        await cart.populate({
            path: "items.productId",
            options: { session }
        });

        return cart;
    });
};

export const clearCartService = async (userId: string) => {
    return withTransaction(async (session) => {
        const cart = await CartModel.findOne({ userId }).session(session);
        if (!cart) throw new Error("Cart not found");

        cart.items = [];
        await cart.save({ session });

        await cart.populate({
            path: "items.productId",
            options: { session }
        });

        return cart;
    });
};

export const updateMultipleCartItemsService = async (userId: string, updates: { productId: string, quantity: number }[]) => {
    return withTransaction(async (session) => {
        // Extract all productIds
        const productIds = updates.map(u => u.productId);

        //Single query for all products
        const productsMap = await getProductsMapWithSession(productIds, session);

        const cart = await CartModel.findOne({ userId }).session(session);
        if (!cart) {
            throw new Error("Cart not found");
        }

        //Calculate total demand per product (including existing cart + new updates)
        const demandMap = new Map<string, number>();

        // Add existing cart quantities
        for (const item of cart.items) {
            const productId = item.productId.toString();
            if (productIds.includes(productId)) {
                demandMap.set(productId, item.quantity);
            }
        }

        // Add update quantities
        for (const update of updates) {
            demandMap.set(update.productId, update.quantity);
        }

        // Validate all updates first
        const errors: string[] = [];
        for (const [productId, totalDemand] of demandMap) {
            const product = productsMap.get(productId);
            if (!product) {
                errors.push(`Product ${productId} not found`);
                continue;
            }
            if (totalDemand > product.totalStock) {
                errors.push(`Product ${product.name}: Requested ${totalDemand}, only ${product.totalStock} available`);
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join("; "));
        }

        // Apply all updates
        for (const update of updates) {
            const item = cart.items.find((i) => i.productId.toString() === update.productId);
            if (item) {
                item.quantity = update.quantity;
            }
        }

        await cart.save({ session });
        await cart.populate({
            path: "items.productId",
            options: { session }
        });
        return cart;
    });
};

export const mergeCartService = async (userId: string, localCartItems: ICartItem[]): Promise<MergeCartResult> => {
    return withTransaction(async (session) => {
        const warnings: { productId: string; reason: string }[] = [];

        if (!localCartItems || localCartItems.length === 0) {
            // Nếu không có local cart, chỉ return server cart
            const cart = await getCartService(userId);
            return { cart, warnings: [] };
        }

        // Lấy server cart hiện tại
        let serverCart = await CartModel.findOne({ userId }).session(session);
        if (!serverCart) {
            serverCart = new CartModel({ userId, items: [] });
        }

        const localProductIds = localCartItems.map(item => item.productId.toString());
        const serverProductIds = serverCart.items.map(item => item.productId.toString());
        const allProductIds = [...new Set([...localProductIds, ...serverProductIds])];

        // ✅ Single query for all products
        const productsMap = await getProductsMapWithSession(allProductIds, session);

        // Check for missing products
        const missingIds = localProductIds.filter(id => !productsMap.has(id));
        for (const id of missingIds) {
            warnings.push({ productId: id, reason: "Product not available" });
        }

        // Merge logic: local cart items vào server cart
        for (const localItem of localCartItems) {
            const productId = localItem.productId.toString();
            const product = productsMap.get(productId);

            if (!product) continue; // skip nếu product không tồn tại

            // Tìm item trong server cart
            const existingServerItem = serverCart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingServerItem) {
                // Nếu đã có trong server cart -> cộng quantity
                const newQuantity = existingServerItem.quantity + localItem.quantity;

                // Validate stock
                if (newQuantity > product.totalStock) {
                    // Option 1: Set max = stock available
                    existingServerItem.quantity = product.totalStock;
                    warnings.push({
                        productId,
                        reason: `Requested ${newQuantity}, but only ${product.totalStock} in stock`
                    });

                    // Option 2: Throw error (uncomment nếu muốn strict)
                    // throw new Error(`Product ${product.name}: Only ${product.totalStock} available, requested ${newQuantity}`);
                } else {
                    existingServerItem.quantity = newQuantity;
                }
            } else {
                // Nếu chưa có trong server cart -> thêm mới
                if (localItem.quantity > product.totalStock) {
                    warnings.push({
                        productId,
                        reason: `Requested ${localItem.quantity}, but only ${product.totalStock} in stock`
                    });
                    // Set max = stock available
                    localItem.quantity = product.totalStock;
                }

                if (localItem.quantity > 0) {
                    serverCart.items.push({
                        productId: new Types.ObjectId(productId),
                        quantity: localItem.quantity
                    });
                }
            }
        }

        await serverCart.save({ session });

        // Return populated cart
        await serverCart.populate({
            path: "items.productId",
            options: { session }
        });
        return { cart: serverCart, warnings };
    });
};

import mongoose from "mongoose";
import Product from "../../models/products.model";

//Transaction wrapper utility
export const withTransaction = async <T>(operation: (session: mongoose.ClientSession) => Promise<T>): Promise<T> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await operation(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

//Helper function với transaction support
export const getProductsMapWithSession = async (productIds: string[], session: mongoose.ClientSession): Promise<Map<string, any>> => {
    const uniqueIds = [...new Set(productIds)]; // Remove duplicates
    const products = await Product.find({
        _id: { $in: uniqueIds },
        active: true // Chỉ lấy active products
    }).session(session); // ✅ Use session
    // Create Map for O(1) lookup
    return new Map(products.map(product => [product._id.toString(), product]));
};
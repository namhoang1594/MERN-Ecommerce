import Product from "../../models/products.model";

export const searchProductsByKeyword = async (keyword: string) => {
    const regEx = new RegExp(keyword, "i");

    const searchQuery = {
        $or: [
            { title: regEx },
            { description: regEx },
            { category: regEx },
            { brand: regEx },
        ],
    };

    const result = await Product.find(searchQuery);
    return result;
};
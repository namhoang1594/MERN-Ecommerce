import Product from "../../models/products.model";


export const removeVietnameseTones = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

export async function searchProductsService(query: string) {
    const normalizedQuery = removeVietnameseTones(query.trim());

    return Product.find({
        $or: [
            { title: { $regex: query.trim(), $options: "i" } },
            { titleWithoutTones: { $regex: normalizedQuery, $options: "i" } },
        ],
    })
        .populate("category", "name")
        .populate("brand", "name");
}
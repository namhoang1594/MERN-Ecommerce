import Product from "../../models/products.model";
import { FilterQuery } from "../../types/products.types";

export const getFilteredProductsService = async ({
    category = [],
    brand = [],
    sortBy = "price-lowtohigh",
}: FilterQuery) => {
    const filters: any = {};

    if (category.length) {
        filters.category = { $in: category };
    }

    if (brand.length) {
        filters.brand = { $in: brand };
    }

    let sort: any = {};

    switch (sortBy) {
        case "price-lowtohigh":
            sort.price = 1;
            break;
        case "price-hightolow":
            sort.price = -1;
            break;
        case "title-atoz":
            sort.title = 1;
            break;
        case "title-ztoa":
            sort.title = -1;
            break;
        default:
            sort.price = 1;
            break;
    }

    const products = await Product.find(filters).sort(sort);
    return products;
};

export const getProductDetailsService = async (id: string) => {
    const product = await Product.findById(id);
    return product;
};
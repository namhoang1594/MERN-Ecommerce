import Product from "../../models/products.model";

export const getProducts = async (query: any) => {
    const {
        search,
        category,
        brand,
        priceMin,
        priceMax,
        sort,
        page = 1,
        limit = 12,
    } = query;

    const filter: any = {};

    // Tìm kiếm theo tên
    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    // Lọc theo category
    if (category) {
        filter.category = category;
    }

    // Lọc theo brand
    if (brand) {
        filter.brand = brand;
    }

    // Lọc theo khoảng giá
    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = Number(priceMin);
        if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Sắp xếp
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case "price_asc":
                sortOption = { price: 1 };
                break;
            case "price_desc":
                sortOption = { price: -1 };
                break;
            case "best_selling":
                sortOption = { sold: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
        }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name slug")
        .populate("brand", "name slug");

    return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    };
};

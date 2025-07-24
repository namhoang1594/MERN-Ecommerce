export interface IProduct {
    image: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePrice?: number;
    totalStock: number;
}

export interface IProductWithId extends IProduct {
    _id: string;
}

export interface FilterQuery {
    category?: string[];
    brand?: string[];
    sortBy?: string;
}

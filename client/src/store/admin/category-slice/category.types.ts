export interface Category {
    _id: string;
    name: string;
    slug?: string;
    image: {
        url: string;
        public_id: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface ICategoryPayload {
    name: string;
    image: {
        url: string;
        public_id: string;
    };
}
export interface Brand {
    _id: string;
    name: string;
    slug?: string;
    description?: string;
    image: {
        url: string;
        public_id: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface IBrandPayload {
    name: string;
    image: {
        url: string;
        public_id: string;
    };
    description?: string;
}
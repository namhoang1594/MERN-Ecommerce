
export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: {
        url: string;
        public_id: string;
    };
}

export interface BrandState {
    brands: Brand[];
    loading: boolean;
    error: string | null;
}
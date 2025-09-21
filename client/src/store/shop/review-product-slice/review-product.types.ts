export interface Review {
    _id: string;
    product: string;
    user: {
        _id: string;
        name: string;
        avatar?: { url: string };
    };
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewState {
    reviews: Review[];
    total: number;
    loading: boolean;
    error: string | null;
}

export interface Review {
    _id: string;
    userId: string;
    productId: string;
    reviewValue: number;
    reviewMessage: string;
    createdAt: string;
    [key: string]: any;
}

export interface ReviewState {
    isLoading: boolean;
    reviews: Review[];
}

export interface AddReviewPayload {
    userId: string;
    userName: string;
    productId: string;
    reviewValue: number;
    reviewMessage: string;
    [key: string]: any;
}

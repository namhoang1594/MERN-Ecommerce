export interface IBrand {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image: {
        url: string;
        public_id: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

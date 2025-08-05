export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    image: {
        url: string;
        public_id: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export enum BannerPosition {
    MAIN = "main",
    SIDE_TOP = "side-top",
    SIDE_BOTTOM = "side-bottom"
}
export interface IBanner {
    _id?: string;
    image: {
        url: string;
        public_id: string;
    };
    title?: string;
    link?: string;
    position: BannerPosition;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
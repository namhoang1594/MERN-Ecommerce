
export interface IBannerBase {
    image: string;
    title?: string;
    link?: string;
    position?: "home" | "sale" | "custom";
    isActive?: boolean;
}

export interface IBanner extends IBannerBase {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

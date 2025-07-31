export type BannerPosition = "home" | "sale" | "custom";

export interface IBanner {
    _id: string;
    image: string;
    isActive: boolean;
}

export interface BannerState {
    banners: IBanner[];
    loading: boolean;
}
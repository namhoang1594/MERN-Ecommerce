export interface Banner {
    _id: string;
    image: string;
    title: string;
    link: string;
    position: "home" | "sale" | "custom";
    isActive: boolean;
}

export interface BannerState {
    items: Banner[];
    loading: boolean;
    error: string | null;
}
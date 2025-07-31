export interface ILogo {
    image: string;
    public_id: string;
    isActive: boolean;
}

export interface ISocialLink {
    name: string;
    icon: string;
    url: string;
}

export interface ISettingInfo {
    hotline: string;
    email: string;
    slogan: string;
    footerText: string;
}

export interface ISettingState {
    logos: ILogo[];
    socialLinks: ISocialLink[];
    info: ISettingInfo;
    loading: boolean;
}

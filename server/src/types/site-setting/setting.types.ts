export interface ILogo {
    image: string;
    public_id: string;
    isActive: boolean;
}

export interface ISocialLink {
    icon: string;
    name: string;
    url: string;
}

export interface ISetting {
    logos: ILogo[];
    socialLinks: ISocialLink[];
    hotline?: string;
    email?: string;
    footerText?: string;
    slogan?: string;
}

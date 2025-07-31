import { Schema, model, Document } from "mongoose";

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

export interface ISetting extends Document {
    logos: ILogo[];
    socialLinks: ISocialLink[];
    hotline?: string;
    email?: string;
    footerText?: string;
    slogan?: string;
}

const logoSchema = new Schema<ILogo>(
    {
        image: { type: String, required: true },
        public_id: { type: String, required: true },
        isActive: { type: Boolean, default: false },
    },
    { _id: false }
);

const socialLinkSchema = new Schema<ISocialLink>(
    {
        icon: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
    },
    { _id: false }
);

const settingSchema = new Schema<ISetting>(
    {
        logos: [logoSchema],
        socialLinks: [socialLinkSchema],
        hotline: String,
        email: String,
        footerText: String,
        slogan: String,
    },
    { timestamps: true }
);

export const SettingModel = model<ISetting>("Setting", settingSchema);

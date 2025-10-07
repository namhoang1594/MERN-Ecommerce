import { Schema, model } from "mongoose";
import { BannerPosition, IBanner } from "../../types/site-setting/banner.types";

const bannerSchema = new Schema<IBanner>(
    {
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        title: { type: String, trim: true },
        link: { type: String, trim: true },
        position: {
            type: String,
            enum: Object.values(BannerPosition),
            default: BannerPosition.MAIN,
            required: true
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

bannerSchema.index({ position: 1, isActive: 1 });

export const BannerModel = model<IBanner>("Banner", bannerSchema);

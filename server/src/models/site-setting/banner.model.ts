import { Schema, model, Document } from "mongoose";
import { IBannerBase } from "../../types/site-setting/banner.types";


interface IBannerDoc extends IBannerBase, Document { }

const bannerSchema = new Schema<IBannerDoc>(
    {
        image: { type: String, required: true },
        title: { type: String },
        link: { type: String },
        position: { type: String, enum: ["home", "sale", "custom"], default: "home" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const BannerModel = model<IBannerDoc>("Banner", bannerSchema);

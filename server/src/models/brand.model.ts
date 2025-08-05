import { Schema, model, Document } from "mongoose";
import slugify from "slugify";
import { IBrand } from "../types/brand.types";

interface IBrandDocument extends IBrand, Document {
    _id: string
}

const brandSchema = new Schema<IBrandDocument>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    },
    { timestamps: true }
);

brandSchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Brand = model<IBrandDocument>("Brand", brandSchema);

export default Brand;

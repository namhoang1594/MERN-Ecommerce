import { Schema, model, Document } from "mongoose";
import slugify from "slugify";
import { ICategory } from "../types/category.types";


interface ICategoryDocument extends ICategory, Document {
    _id: string
}

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    },
    { timestamps: true }
);

categorySchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = model<ICategoryDocument>("Category", categorySchema);

export default Category;

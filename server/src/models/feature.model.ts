import { Schema, model, Document } from "mongoose";
import { IFeature } from "../types/feature.types";

const FeatureSchema: Schema = new Schema<IFeature>(
  {
    image: String,
  },
  { timestamps: true }
);
const Feature = model<IFeature & Document>("Feature", FeatureSchema);

export default Feature;
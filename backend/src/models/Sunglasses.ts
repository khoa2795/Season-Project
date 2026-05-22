import mongoose, { Document, Schema } from "mongoose";
import {
  baseProductDefinition,
  type IBaseProductFields,
  type IBaseSpecifications,
  productGenderField,
} from "./sharedProduct.js";

export interface ISunglasses extends Document, IBaseProductFields {
  type: "Sunglasses";
  specifications: IBaseSpecifications;
}

const SunglassesSchema = new Schema<ISunglasses>(
  {
    ...baseProductDefinition,
    type: { type: String, default: "Sunglasses" },
    specifications: {
      gender: productGenderField,
    },
  },
  { timestamps: true },
);

SunglassesSchema.index({ "variants.sku": 1 });

export const Sunglasses = mongoose.model<ISunglasses>(
  "Sunglasses",
  SunglassesSchema,
);

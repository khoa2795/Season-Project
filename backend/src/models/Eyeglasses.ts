import mongoose, { Document, Schema } from "mongoose";
import {
  baseProductDefinition,
  type IBaseProductFields,
  type IBaseSpecifications,
  productGenderField,
} from "./sharedProduct.js";

export interface IFrameType {
  material: "Acetate" | "Metal";
  size: "Small" | "Medium" | "Big";
}

export interface IEyeglassesSpecifications extends IBaseSpecifications {
  frameType: IFrameType;
}

export interface IEyeglasses extends Document, IBaseProductFields {
  type: "Eyeglasses";
  specifications: IEyeglassesSpecifications;
}

const EyeglassesSchema = new Schema<IEyeglasses>(
  {
    ...baseProductDefinition,
    type: { type: String, default: "Eyeglasses" },
    specifications: {
      frameType: {
        size: {
          type: String,
          enum: ["Small", "Medium", "Big"],
          required: true,
        },
        material: {
          type: String,
          enum: ["Acetate", "Metal"],
          required: true,
        },
      },
      gender: productGenderField,
    },
  },
  { timestamps: true },
);

export const Eyeglasses = mongoose.model<IEyeglasses>(
  "Eyeglasses",
  EyeglassesSchema,
);

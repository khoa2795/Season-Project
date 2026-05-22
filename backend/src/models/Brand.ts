import mongoose, { Document, Schema } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Brand = mongoose.model<IBrand>("Brand", BrandSchema);

import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: Types.ObjectId;
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
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
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      validate: {
        validator(
          this: ICategory,
          parentCategoryId: Types.ObjectId | undefined,
        ): boolean {
          if (parentCategoryId === undefined || parentCategoryId === null) {
            return true;
          }

          return parentCategoryId.equals(this._id as Types.ObjectId) === false;
        },
        message: "Category cannot be its own parent",
      },
    },
    order: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

CategorySchema.index({ parentCategoryId: 1, name: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);

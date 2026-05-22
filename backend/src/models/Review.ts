import mongoose, { Document, Schema, Types } from "mongoose";
import {
  productReferenceDefinition,
  type IProductReference,
} from "./sharedProduct.js";

export interface IReview extends Document, IProductReference {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  likedBy: Types.ObjectId[];
  isVerifiedPurchase: boolean;
  isActive: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required(this: IReview): boolean {
        return this.isVerifiedPurchase === true;
      },
    },
    ...productReferenceDefinition,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    images: {
      type: [String],
      default: (): string[] => [],
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

ReviewSchema.index(
  { userId: 1, productModel: 1, productId: 1 },
  { unique: true },
);
ReviewSchema.index({ productModel: 1, productId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);

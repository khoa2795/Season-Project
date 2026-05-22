import mongoose, { Document, Schema, Types } from "mongoose";
import {
  productReferenceDefinition,
  type IProductReference,
} from "./sharedProduct.js";

export interface ICartItem extends IProductReference {
  variantSku: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
}

function hasUniqueItems(items: ICartItem[]): boolean {
  const itemKeys = new Set<string>();

  for (const item of items) {
    const itemKey = `${item.productModel}:${item.productId.toString()}:${item.variantSku}`;

    if (itemKeys.has(itemKey) === true) {
      return false;
    }

    itemKeys.add(itemKey);
  }

  return true;
}

export const CartItemSchema = new Schema<ICartItem>(
  {
    ...productReferenceDefinition,
    variantSku: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: (): ICartItem[] => [],
      validate: {
        validator: hasUniqueItems,
        message: "Cart cannot contain duplicate product variants",
      },
    },
  },
  { timestamps: true, optimisticConcurrency: true },
);

CartSchema.index({ "items.productModel": 1, "items.productId": 1 });

export const Cart = mongoose.model<ICart>("Cart", CartSchema);

import { Schema, Types } from "mongoose";

export type ProductAvailability = "in_stock" | "out_of_stock" | "pre_order";
export type ProductGender = "Male" | "Female" | "Unisex";
export type ProductModelName = (typeof PRODUCT_MODEL_NAMES)[number];

const PRODUCT_AVAILABILITIES: ProductAvailability[] = [
  "in_stock",
  "out_of_stock",
  "pre_order",
];

const PRODUCT_GENDERS: ProductGender[] = ["Male", "Female", "Unisex"];

export const PRODUCT_MODEL_NAMES = ["Eyeglasses", "Sunglasses"] as const;

export interface IVariant {
  sku: string;
  color?: string;
  price: number;
  images: string[];
  isDefault: boolean;
  stock: number;
}

export interface IProductRating {
  avg: number;
  count: number;
}

export interface IBaseSpecifications {
  gender: ProductGender;
}

export interface IBaseProductFields {
  name: string;
  slug: string;
  collectionId: Types.ObjectId;
  brandId: Types.ObjectId;
  categoryId: Types.ObjectId;
  brand: string;
  salePercent: number;
  availability: ProductAvailability;
  description: string;
  variants: IVariant[];
  rating: IProductRating;
  isActive: boolean;
}

export interface IProductReference {
  productId: Types.ObjectId;
  productModel: ProductModelName;
}

export const ratingSchema = new Schema<IProductRating>(
  {
    avg: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

export const variantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true },
    color: String,
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    isDefault: { type: Boolean, default: false },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const baseProductDefinition = {
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  collectionId: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
    index: true,
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
    index: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },
  brand: { type: String, required: true },
  salePercent: { type: Number, min: 0, max: 30, default: 0 },
  availability: {
    type: String,
    enum: PRODUCT_AVAILABILITIES,
    default: "in_stock" as ProductAvailability,
  },
  description: { type: String, required: true },
  variants: { type: [variantSchema], default: (): IVariant[] => [] },
  rating: { type: ratingSchema, default: () => ({ avg: 0, count: 0 }) },
  isActive: { type: Boolean, default: true },
};

export const productGenderField = {
  type: String,
  enum: PRODUCT_GENDERS,
  default: "Unisex" as ProductGender,
};

export const productReferenceDefinition = {
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref(this: IProductReference): ProductModelName {
      return this.productModel;
    },
  },
  productModel: {
    type: String,
    required: true,
    enum: PRODUCT_MODEL_NAMES,
  },
};

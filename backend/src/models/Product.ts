import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVariant {
  sku: string;
  color?: string;
  size?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  isDefault: boolean;
}

export interface ISpecifications {
  material?: string;
  lensMaterial?: string;
  origin?: string;
  gender: 'Male' | 'Female' | 'Unisex';
  size: {
    dimensions?: string;
    width?: number;
    angle?: number;
    bridge?: number;
    totalWidth?: number;
    longestDiameter?: number;
  };
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  collectionId: Types.ObjectId;
  brand: string;
  sale: boolean;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  type: string;
  description: string;
  specifications: ISpecifications;
  variants: IVariant[];
  rating: {
    avg: number;
    count: number;
  };
  isActive: boolean;
}

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  collectionId: { type: Schema.Types.ObjectId, ref: 'Collection', required: true },
  brand: { type: String, required: true },
  sale: { type: Boolean, default: false },
  availability: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
  type: { type: String, default: "Sunglasses" },
  description: { type: String, required: true },
  specifications: {
    material: String,
    lensMaterial: String,
    origin: String,
    gender: { type: String, enum: ['Male', 'Female', 'Unisex'], default: 'Unisex' },
    size: {
      dimensions: String,
      width: Number,
      angle: Number,
      bridge: Number,
      totalWidth: Number,
      longestDiameter: Number
    }
  },
  variants: [{
    sku: { type: String, required: true }, // Not globally unique here, just within the variants or maybe globally
    color: String,
    size: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    isDefault: { type: Boolean, default: false }
  }],
  rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

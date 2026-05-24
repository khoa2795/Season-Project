import { ProductAvailabilityEnum, ProductGenderEnum } from "../enums";
import type { ProductAvailability, ProductGender } from "./type";

export interface RatingArgs {
  avg: number;
  count: number;
}

export class Rating {
  avg: number;
  count: number;

  constructor(args: RatingArgs) {
    this.avg = args.avg;
    this.count = args.count;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static deser(data: any): Rating {
    return new Rating({
      avg: data?.avg ?? 0,
      count: data?.count ?? 0,
    });
  }
}

export interface ProductVariantArgs {
  sku: string;
  color?: string;
  price: number;
  images: string[];
  isDefault: boolean;
  stock: number;
}

export class ProductVariant {
  sku: string;
  color?: string;
  price: number;
  images: string[];
  isDefault: boolean;
  stock: number;

  constructor(args: ProductVariantArgs) {
    this.sku = args.sku;
    this.color = args.color;
    this.price = args.price;
    this.images = args.images;
    this.isDefault = args.isDefault;
    this.stock = args.stock;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static deser(data: any): ProductVariant {
    return new ProductVariant({
      sku: data?.sku ?? "",
      color: data?.color ?? undefined,
      price: data?.price ?? 0,
      images: data?.images ?? [],
      isDefault: data?.isDefault ?? false,
      stock: data?.stock ?? 0,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAvailabilityOrDefault = (value: any): ProductAvailability =>
  value === ProductAvailabilityEnum.InStock ||
  value === ProductAvailabilityEnum.OutOfStock ||
  value === ProductAvailabilityEnum.PreOrder
    ? value
    : ProductAvailabilityEnum.InStock;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGenderOrDefault = (value: any): ProductGender =>
  value === ProductGenderEnum.Male ||
  value === ProductGenderEnum.Female ||
  value === ProductGenderEnum.Unisex
    ? value
    : ProductGenderEnum.Unisex;

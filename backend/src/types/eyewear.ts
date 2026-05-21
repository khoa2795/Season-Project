import type { IBaseProductFields, IVariant } from "../models/sharedProduct.js";
import type {
  FrameMaterial,
  IEyeglassesSpecifications,
} from "../models/Eyeglasses.js";
import type { ISunglasses } from "../models/Sunglasses.js";
import type { Types } from "mongoose";
import type { ProductGender } from "../models/sharedProduct.js";

export interface BaseQueryParams {
  offset?: number | string;
  limit?: number | string;
}

export interface EyeglassesQueryParams extends BaseQueryParams {
  frameType?: string;
  collectionSlug?: string;
  gender?: string;
  sale?: string;
}

export interface SunglassesQueryParams extends BaseQueryParams {
  collectionSlug?: string;
  gender?: string;
  sale?: string;
}

export interface ValidatedEyeglassesQuery {
  frameType: FrameMaterial | null;
  collectionSlug: string | null;
  gender: ProductGender | null;
  sale: boolean;
  offset: number;
  limit: number;
}

export interface ValidatedSunglassesQuery {
  collectionSlug: string | null;
  gender: ProductGender | null;
  sale: boolean;
  offset: number;
  limit: number;
}

export interface CollectionFilterResponse {
  id: string;
  name: string;
  slug: string;
  inStockCount: number;
}

export interface CollectionFiltersResponseData {
  records: CollectionFilterResponse[];
}

export interface BaseProductResponse {
  id: string;
  name: string;
  slug: string;
  type: string;
  brand: string;
  collectionId: string;
  salePercent: IBaseProductFields["salePercent"];
  availability: IBaseProductFields["availability"];
  description: string;
  variants: IVariant[];
  rating: IBaseProductFields["rating"];
  isActive: boolean;
}

export interface EyeglassesProductResponse extends BaseProductResponse {
  specifications: IEyeglassesSpecifications;
}

export interface SunglassesProductResponse extends BaseProductResponse {
  specifications: ISunglasses["specifications"];
}

export interface EyeglassesResponseData {
  records: EyeglassesProductResponse[];
  total: number;
}

export interface SunglassesResponseData {
  records: SunglassesProductResponse[];
  total: number;
}

export interface ErrorResponse {
  error?: string;
}

export interface BaseDatabaseProduct {
  _id: string;
  name: string;
  slug: string;
  type: string;
  collectionId: Types.ObjectId | string;
  brand: string;
  salePercent: IBaseProductFields["salePercent"];
  availability: IBaseProductFields["availability"];
  description: string;
  rating: IBaseProductFields["rating"];
  variants: IVariant[];
  isActive: boolean;
}

export interface DatabaseEyeglassesProduct extends BaseDatabaseProduct {
  specifications: IEyeglassesSpecifications;
}

export interface DatabaseSunglassesProduct extends BaseDatabaseProduct {
  specifications: ISunglasses["specifications"];
}

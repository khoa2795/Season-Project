/**
 * TypeScript types and interfaces for glasses API
 */

export interface GlassesQueryParams {
  category?: string; // "sunglasses" or "eyeglasses"
  frameType?: string; // "Acetate" or "Metal" (eyeglasses only)
  offset?: number | string;
  limit?: number | string;
}

export interface ValidatedGlassesQuery {
  category: string | null; // null if not specified
  frameType: string | null;
  offset: number;
  limit: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  sku: string;
  color: string;
  price: number;
  originalPrice: number;
  images: string[];
  isDefault: boolean;
  stock: number;
}

export interface FrameType {
  material: string; // "Acetate" or "Metal"
  size: string; // "Small", "Medium", or "Big"
}

export interface Specifications {
  frameType?: FrameType;
  gender: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  type: string; // "Sunglasses" or "Eyeglasses"
  brand: string;
  price: number;
  originalPrice: number;
  images: string[];
  availability: string; // "in_stock", "out_of_stock", "pre_order"
  rating: {
    avg: number;
    count: number;
  };
}

export interface PaginationData {
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface GlassesResponseData {
  products: ProductResponse[];
  pagination: PaginationData;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DatabaseProduct {
  _id: string;
  name: string;
  slug: string;
  type: string;
  brand: string;
  specifications: Specifications;
  availability: string;
  rating: {
    avg: number;
    count: number;
  };
  variants: ProductVariant[];
}

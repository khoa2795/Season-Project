import type { ProductModelName } from "../models/sharedProduct.js";

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewResponse {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  productModel: ProductModelName;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  likeCount: number;
  isVerifiedPurchase: boolean;
  isActive: boolean;
}

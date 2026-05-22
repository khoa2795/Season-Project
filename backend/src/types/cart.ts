import type { ProductModelName } from "../models/sharedProduct.js";

export interface AddCartItemInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  productId: string;
  quantity: number;
}

export interface CartSkuInput {
  sku: string;
  quantity: number;
}

export interface CartItemResponse {
  productId: string;
  productModel: ProductModelName;
  variantSku: string;
  quantity: number;
}

export interface CartResponseData {
  id: string;
  userId: string;
  items: CartItemResponse[];
}

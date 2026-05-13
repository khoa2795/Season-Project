import type { DatabaseProduct, ProductResponse } from "../types/eyewear.js";

export function transformProduct(product: DatabaseProduct): ProductResponse {
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0];

  if (defaultVariant === undefined) {
    throw new Error(`Product ${product._id} has no variants`);
  }

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    type: product.type,
    brand: product.brand,
    price: defaultVariant.price,
    originalPrice: defaultVariant.originalPrice ?? defaultVariant.price,
    images: defaultVariant.images,
    availability: product.availability,
    rating: product.rating,
  };
}

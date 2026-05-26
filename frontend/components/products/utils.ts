import { ProductCard } from "@/lib/model/misc";
import { Product, type ProductArgs } from "@/lib/model/product/product";

function getAvailableVariants(product: Product) {
  return product.variants.filter((variant) => variant.stock > 0);
}

export function toProductCard(product: Product): ProductCard {
  const availableVariants = getAvailableVariants(product);
  const displayVariant =
    availableVariants.find((variant) => variant.isDefault) ??
    availableVariants[0] ??
    product.defaultVariant;
  const displayPrice = displayVariant?.price ?? 0;
  const availableColorCount = availableVariants.length;

  return {
    id: product.id,
    type: product.type,
    title: product.name,
    slug: product.slug,
    images: availableVariants
      .map((variant) => variant.images[0] ?? "")
      .filter((image) => image !== ""),
    colorCount:
      availableColorCount === 1
        ? "1 Color"
        : `${availableColorCount} Colors`,
    price: displayPrice,
    originalPrice:
      product.salePercent > 0
        ? Math.round(displayPrice / (1 - product.salePercent / 100))
        : displayPrice,
    isOnSale: product.isOnSale,
    meta: `${product.frameSize} / ${product.frameMaterial}`,
    hasAvailableStock: availableVariants.length > 0,
  };
}
export type ProductModel = Product;

export function toProductCards(products: ProductModel[]): ProductCard[] {
  return products.map(toProductCard);
}

export type SerializedProductRecord = ProductArgs;

export function deserializeProductRecord(
  record: SerializedProductRecord,
): ProductModel {
  return Product.deser(record);
}

// General hydration function that can handle both product types based on the type field in the serialized record. This is useful for scenarios where we have a mixed list of products and need to hydrate them without knowing the category upfront.
export function hydrateProducts(
  records: SerializedProductRecord[],
): ProductModel[] {
  return records.map(deserializeProductRecord);
}

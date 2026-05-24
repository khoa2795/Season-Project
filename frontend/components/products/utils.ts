import { ProductCard } from "@/lib/model/misc";
import { Product, type ProductArgs } from "@/lib/model/product/product";

export function toProductCard(product: Product): ProductCard {
  return {
    id: product.id,
    type: product.type,
    title: product.name,
    slug: product.slug,
    images: product.variants
      .map((variant) => variant.images[0] ?? "")
      .filter((image) => image !== ""),
    colorCount: product.variantCountLabel,
    price: product.price,
    originalPrice: product.originalPrice,
    isOnSale: product.isOnSale,
    meta: `${product.frameSize} / ${product.frameMaterial}`,
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

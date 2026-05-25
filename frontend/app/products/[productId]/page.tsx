import { toPlainObject } from "@/lib/model/misc";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/view-product-detail/product-detail";
import {
  fetchCollectionFilters,
  fetchProductById,
  fetchCollectionProductsBatch,
} from "@/lib/model";
import type { Product } from "@/lib/model";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductsPage({ params }: ProductPageProps) {
  const { productId } = await params;

  let relatedProducts: Product[] = [];
  let collectionSlug: string | undefined;
  let product: Product;

  try {
    product = await fetchProductById(productId);

    const collections = await fetchCollectionFilters();
    const matchedCollection = collections.find(
      (collection) => collection.id === product.collectionId,
    );

    if (matchedCollection !== undefined) {
      collectionSlug = matchedCollection.slug;

      const relatedCollectionData = await fetchCollectionProductsBatch(
        collectionSlug,
        0,
        8,
        undefined,
      );
      relatedProducts = relatedCollectionData.records;
    }
  } catch {
    console.error(`Failed to fetch product with id ${productId}`);
    notFound();
  }

  return (
    <ProductDetailView
      product={toPlainObject(product)}
      relatedProducts={toPlainObject(relatedProducts)}
      collectionSlug={collectionSlug}
    />
  );
}

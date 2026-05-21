import { api } from "@/lib/api";
import { ProductTypeEnum } from "@/lib/enums";
import type { CollectionFilterRecord, ProductCard, ProductsPageData } from "./misc";
import { fetchEyeglassesCollectionBatch } from "./eyeglasses/eyeglasses-api";
import { fetchSunglassesCollectionBatch } from "./sunglasses/sunglasses-api";

function isCollectionFilterRecord(
  value: unknown,
): value is CollectionFilterRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.slug === "string" &&
    typeof record.inStockCount === "number"
  );
}

export async function fetchCollectionFilters(
  productType?: ProductTypeEnum,
): Promise<CollectionFilterRecord[]> {
  const response = await api.get("/collections", {
    params: {
      productType,
    },
  });

  const data = response.data;

  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid collections response payload.");
  }

  const records = (data as { records?: unknown }).records;

  if (!Array.isArray(records)) {
    throw new Error("Invalid collections response records.");
  }

  if (!records.every(isCollectionFilterRecord)) {
    throw new Error("Invalid collection filter record.");
  }

  return records;
}

function mergeCollectionProducts(products: ProductCard[]): ProductCard[] {
  return [...products].sort((left, right) => {
    const titleComparison = left.title.localeCompare(right.title);

    if (titleComparison !== 0) {
      return titleComparison;
    }

    return left.slug.localeCompare(right.slug);
  });
}

async function fetchAllCollectionProductsByType(
  fetchBatch: (
    collectionSlug: string,
    offset: number,
    limit?: number,
  ) => Promise<{ records: ProductCard[]; total: number }>,
  collectionSlug: string,
) {
  const records: ProductCard[] = [];
  let offset = 0;
  let total = 0;

  do {
    const response = await fetchBatch(collectionSlug, offset);
    records.push(...response.records);
    total = response.total;
    offset += response.records.length;
  } while (offset < total && total > 0);

  return records;
}

export async function getCollectionPageData(
  collectionSlug: string,
): Promise<ProductsPageData> {
  const [eyeglassesRecords, sunglassesRecords] = await Promise.all([
    fetchAllCollectionProductsByType(
      fetchEyeglassesCollectionBatch,
      collectionSlug,
    ),
    fetchAllCollectionProductsByType(
      fetchSunglassesCollectionBatch,
      collectionSlug,
    ),
  ]);

  const allProducts = mergeCollectionProducts([
    ...eyeglassesRecords,
    ...sunglassesRecords,
  ]);

  return {
    initialProducts: allProducts.slice(0, 12),
    totalItems: allProducts.length,
    allProducts,
  };
}

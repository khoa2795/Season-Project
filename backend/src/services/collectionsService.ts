import { Collection } from "../models/Collection.js";
import type {
  CollectionFilterResponse,
  CollectionFiltersResponseData,
  ValidatedCollectionFiltersQuery,
} from "../types/eyewear.js";

function toCollectionResponse(
  collection: {
    _id: unknown;
    name: string;
    slug: string;
    eyeglassesInStockCount: number;
    sunglassesInStockCount: number;
  },
  productType: ValidatedCollectionFiltersQuery["productType"],
): CollectionFilterResponse {
  const inStockCount =
    productType === "eyeglasses"
      ? collection.eyeglassesInStockCount
      : collection.sunglassesInStockCount;

  return {
    id: String(collection._id),
    name: collection.name,
    slug: collection.slug,
    inStockCount,
  };
}

export async function getCollectionFiltersByProductType(
  query: ValidatedCollectionFiltersQuery,
): Promise<CollectionFiltersResponseData> {
  const countField =
    query.productType === "eyeglasses"
      ? "eyeglassesInStockCount"
      : "sunglassesInStockCount";

  const collections = await Collection.find({
    [countField]: { $gt: 0 },
  })
    .select(`name slug eyeglassesInStockCount sunglassesInStockCount`)
    .sort({ name: 1 })
    .lean<
      Array<{
        _id: unknown;
        name: string;
        slug: string;
        eyeglassesInStockCount: number;
        sunglassesInStockCount: number;
      }>
    >();

  return {
    records: collections.map((collection) =>
      toCollectionResponse(collection, query.productType),
    ),
  };
}

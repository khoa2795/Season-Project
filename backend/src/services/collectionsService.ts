import { Collection } from "../models/Collection.js";
import type {
  CollectionFilterResponse,
  CollectionFiltersResponseData,
} from "../types/eyewear.js";

function toCollectionResponse(collection: {
  _id: unknown;
  name: string;
  slug: string;
  inStockCount: number;
}): CollectionFilterResponse {
  return {
    id: String(collection._id),
    name: collection.name,
    slug: collection.slug,
    inStockCount: collection.inStockCount,
  };
}

export async function getCollectionFilters(): Promise<CollectionFiltersResponseData> {
  const filter = { inStockCount: { $gt: 0 } };

  const collections = await Collection.find(filter)
    .select(`name slug inStockCount`)
    .sort({ name: 1 })
    .lean<
      Array<{
        _id: unknown;
        name: string;
        slug: string;
        inStockCount: number;
      }>
    >();

  return {
    records: collections.map((collection) => toCollectionResponse(collection)),
  };
}

import { fetchList, type ListResponse } from "@/lib/fetcher";
import { Collection } from "./collection";
import { Product } from "../product/product";
import type { ProductsQueryState } from "../misc";
import { DEFAULT_PRODUCT_SORT, PAGE_SIZE } from "../misc";
import { serializePaginationQuery } from "@/lib/serialize";
import { serializeProductQuery } from "../product/product-query";

export async function fetchCollectionFilters(): Promise<Collection[]> {
  const response = await fetchList("/collections", Collection);

  return response.records;
}

export async function fetchCollectionProductsBatch(
  collectionSlug: string,
  offset: number,
  limit: number = PAGE_SIZE,
  queryState: ProductsQueryState = {
    sort: DEFAULT_PRODUCT_SORT,
    frameType: null,
    frameSize: null,
  },
): Promise<ListResponse<Product>> {
  return fetchList(`/collections/${collectionSlug}/products`, Product, {
    ...serializeProductQuery({
      frameType: queryState.frameType ?? undefined,
      frameSize: queryState.frameSize ?? undefined,
    }),
    sort: queryState.sort,
    ...serializePaginationQuery({ offset, limit }),
  });
}


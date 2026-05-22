import { api } from "@/lib/api";
import { fetchList, type ListResponse } from "@/lib/fetcher";
import { ProductTypeEnum } from "@/lib/enums";
import { Collection } from "./collection";
import { EyeglassesProduct } from "../eyeglasses/eyeglasses";
import { SunglassesProduct } from "../sunglasses/sunglasses";
import type { ProductSortValue } from "../misc";
import { DEFAULT_PRODUCT_SORT, PAGE_SIZE } from "../misc";
import { serializePaginationQuery } from "@/lib/serialize";

export type CollectionProduct = EyeglassesProduct | SunglassesProduct;

function deserializeCollectionProduct(data: any): CollectionProduct {
  const normalizedType = String(data?.type ?? "")
    .trim()
    .toLowerCase();

  if (normalizedType === String(ProductTypeEnum.sunglasses).toLowerCase()) {
    return SunglassesProduct.deser({
      ...data,
      type: ProductTypeEnum.sunglasses,
    });
  }

  return EyeglassesProduct.deser({
    ...data,
    type: ProductTypeEnum.eyeglasses,
  });
}

export async function fetchCollectionFilters(): Promise<Collection[]> {
  const response = await fetchList("/collections", Collection);

  return response.records;
}

export async function fetchCollectionProductsBatch(
  collectionSlug: string,
  offset: number,
  limit: number = PAGE_SIZE,
  sort: ProductSortValue = DEFAULT_PRODUCT_SORT,
): Promise<ListResponse<CollectionProduct>> {
  const response = await api.get(`/collections/${collectionSlug}/products`, {
    params: {
      sort,
      ...serializePaginationQuery({ offset, limit }),
    },
  });
  const data = response.data;

  if (data === undefined) {
    throw new Error(
      `Missing response data from /collections/${collectionSlug}/products`,
    );
  }

  return {
    records: (data.records ?? []).map((record: any) =>
      deserializeCollectionProduct(record),
    ),
    total: data.total ?? 0,
  };
}

export async function getCollectionPageData(
  collectionSlug: string,
  sort: ProductSortValue = DEFAULT_PRODUCT_SORT,
): Promise<ListResponse<CollectionProduct>> {
  return fetchCollectionProductsBatch(collectionSlug, 0, PAGE_SIZE, sort);
}

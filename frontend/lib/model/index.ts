import { ListResponse } from "@/lib/fetcher";
import { ProductTypeEnum } from "@/lib/enums";
import type { EyeglassesView, SunglassesView } from "./type";
import { isSunglassesSlug, isEyeglassesSlug } from "./misc";
import { PAGE_SIZE, ProductCard } from "./misc";
import {
  fetchSunglassesBatch,
  fetchSunglassesCollectionBatch,
} from "./sunglasses/sunglasses-api";
import {
  fetchEyeglassesBatch,
  fetchEyeglassesCollectionBatch,
} from "./eyeglasses/eyeglasses-api";

export async function fetchProductsBatchByCategory(
  category: ProductTypeEnum,
  view: EyeglassesView | SunglassesView,
  offset: number,
  limit: number = PAGE_SIZE,
  collectionSlug?: string,
): Promise<ListResponse<ProductCard>> {
  if (
    category === ProductTypeEnum.eyeglasses &&
    view === "view-by-collection" &&
    collectionSlug !== undefined &&
    collectionSlug !== ""
  ) {
    return fetchEyeglassesCollectionBatch(collectionSlug, offset, limit);
  }

  if (category === ProductTypeEnum.eyeglasses && isEyeglassesSlug(view)) {
    return fetchEyeglassesBatch(view, offset, limit);
  }

  if (
    category === ProductTypeEnum.sunglasses &&
    view === "view-by-collection" &&
    collectionSlug !== undefined &&
    collectionSlug !== ""
  ) {
    return fetchSunglassesCollectionBatch(collectionSlug, offset, limit);
  }

  if (category === ProductTypeEnum.sunglasses && isSunglassesSlug(view)) {
    return fetchSunglassesBatch(view, offset, limit);
  }

  return {
    records: [],
    total: 0,
  };
}

export * from "./eyeglasses/eyeglasses-api";
export * from "./sunglasses/sunglasses-api";
export * from "./shared";
export * from "./eyeglasses/eyeglasses";
export * from "./eyeglasses/eyeglasses-query";
export * from "./sunglasses/sunglasses";
export * from "./sunglasses/sunglasses-query";
export * from "./collections";

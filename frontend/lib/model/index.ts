import { ListResponse } from "@/lib/fetcher";
import { ProductTypeEnum } from "@/lib/enums";
import type { ProductRouteView } from "./type";
import { isSunglassesSlug, isEyeglassesSlug } from "./misc";
import { PAGE_SIZE, ProductsQueryState } from "./misc";
import { fetchSunglassesBatch } from "./sunglasses/sunglasses-api";
import { fetchEyeglassesBatch } from "./eyeglasses/eyeglasses-api";
import { EyeglassesProduct } from "./eyeglasses/eyeglasses";
import { SunglassesProduct } from "./sunglasses/sunglasses";

export async function fetchProductsBatchByCategory(
  category: ProductTypeEnum,
  view: ProductRouteView,
  offset: number,
  limit: number = PAGE_SIZE,
  queryState: ProductsQueryState,
): Promise<ListResponse<EyeglassesProduct | SunglassesProduct>> {
  if (category === ProductTypeEnum.eyeglasses && isEyeglassesSlug(view)) {
    return fetchEyeglassesBatch(view, offset, limit, queryState);
  }

  if (category === ProductTypeEnum.sunglasses && isSunglassesSlug(view)) {
    return fetchSunglassesBatch(view, offset, limit, queryState.sort);
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
export * from "./collections/collections-api";
export * from "./collections/collection";

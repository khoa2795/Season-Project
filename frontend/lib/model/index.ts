import { ListResponse } from "@/lib/fetcher";
import { ProductTypeEnum } from "@/lib/enums";
import type { EyeglassesView, SunglassesView } from "./type";
import type { EyeglassesQuery } from "./eyeglasses/eyeglasses-query";
import type { SunglassesQuery } from "./sunglasses/sunglasses-query";
import { isSunglassesSlug, isEyeglassesSlug } from "./misc";
import { PAGE_SIZE, ProductCard } from "./misc";
import { fetchSunglassesBatch } from "./sunglasses/sunglasses-api";
import { fetchEyeglassesBatch } from "./eyeglasses/eyeglasses-api";

export async function fetchProductsBatchByCategory(
  category: ProductTypeEnum,
  view: EyeglassesView | SunglassesView,
  offset: number,
  limit: number = PAGE_SIZE,
  query?: EyeglassesQuery | SunglassesQuery,
): Promise<ListResponse<ProductCard>> {
  if (category === ProductTypeEnum.eyeglasses && isEyeglassesSlug(view)) {
    return fetchEyeglassesBatch(view, offset, limit, query as EyeglassesQuery);
  }

  if (category === ProductTypeEnum.sunglasses && isSunglassesSlug(view)) {
    return fetchSunglassesBatch(view, offset, limit, query as SunglassesQuery);
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

import { api } from "@/lib/api";
import { ProductTypeEnum } from "@/lib/enums";
import type { CollectionFilterRecord } from "./misc";

export async function fetchCollectionFilters(
  productType: ProductTypeEnum,
): Promise<CollectionFilterRecord[]> {
  const response = await api.get("/collections", {
    params: {
      productType,
    },
  });

  const data = response.data;

  return (data?.records ?? []) as CollectionFilterRecord[];
}

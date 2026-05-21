export type SunglassesQuery = {
  collectionSlug?: string;
  sale?: boolean;
  sort?: "price_asc" | "price_desc" | "name_asc" | "newest" | "rating_desc";
};

export function serializeSunglassesQuery(params: SunglassesQuery) {
  return {
    collectionSlug: params.collectionSlug,
    sale: params.sale,
    sort: params.sort ?? "newest",
  };
}

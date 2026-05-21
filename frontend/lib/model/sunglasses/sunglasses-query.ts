import { ProductGenderEnum } from "@/lib/enums";

export type SunglassesQuery = {
  collectionSlug?: string;
  gender?: ProductGenderEnum;
  sale?: boolean;
};

export function serializeSunglassesQuery(params: SunglassesQuery) {
  return {
    collectionSlug: params.collectionSlug,
    gender: params.gender,
    sale: params.sale,
  };
}

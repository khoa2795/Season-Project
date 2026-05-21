import { FrameMaterialEnum, ProductGenderEnum } from "@/lib/enums";

export type EyeglassesQuery = {
  gender?: ProductGenderEnum;
  collectionSlug?: string;
  frameType?: FrameMaterialEnum;
  sale?: boolean;
};

export function serializeEyeglassesQuery(params: EyeglassesQuery) {
  return {
    collectionSlug: params.collectionSlug,
    gender: params.gender,
    sale: params.sale,
    frameType: params.frameType,
  };
}

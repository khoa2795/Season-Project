import {
  FrameMaterialEnum,
  FrameSizeEnum,
  ProductGenderEnum,
  ProductTypeEnum,
} from "@/lib/enums";

export type ProductQuery = {
  type?: ProductTypeEnum;
  collectionSlug?: string;
  gender?: ProductGenderEnum;
  frameType?: FrameMaterialEnum;
  frameSize?: FrameSizeEnum;
  sale?: boolean;
};

export function serializeProductQuery(params: ProductQuery) {
  return {
    type: params.type,
    collectionSlug: params.collectionSlug,
    gender: params.gender,
    sale: params.sale,
    frameType: params.frameType,
    frameSize: params.frameSize,
  };
}

import { FrameMaterialEnum, FrameSizeEnum } from "@/lib/enums";

export type EyeglassesQuery = {
  frameType?: FrameMaterialEnum;
  frameSize?: FrameSizeEnum;
  sale?: boolean;
  sort?: "price_asc" | "price_desc" | "name_asc" | "newest" | "rating_desc";
};

export function serializeEyeglassesQuery(params: EyeglassesQuery) {
  return {
    sale: params.sale,
    frameSize: params.frameSize,
    frameType: params.frameType,
    sort: params.sort ?? "newest",
  };
}

import { FrameMaterialEnum, FrameSizeEnum } from "@/lib/enums";

export type EyeglassesQuery = {
  frameType?: FrameMaterialEnum;
  frameSize?: FrameSizeEnum;
};

export function serializeEyeglassesQuery(params: EyeglassesQuery) {
  return {
    frameSize: params.frameSize,
    frameType: params.frameType,
  };
}

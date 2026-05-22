import {
  FrameMaterialEnum,
  ProductAvailabilityEnum,
  ProductGenderEnum,
  ProductTypeEnum,
} from "../enums";

export type ProductType = ProductTypeEnum;
export type ProductAvailability = ProductAvailabilityEnum;
export type ProductGender = ProductGenderEnum;
export type FrameMaterial = FrameMaterialEnum;
export type FrameSize = "Small" | "Medium" | "Big";
export type ProductRouteView = "view-all" | "men" | "women" | "sale";

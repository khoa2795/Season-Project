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

export enum EyeglassesView {
  ViewAll = "view-all",
  Men = "men",
  Women = "women",
  Sale = "sale",
}

export enum SunglassesView {
  ViewAll = "view-all",
  Men = "men",
  Women = "women",
  Sale = "sale",
}

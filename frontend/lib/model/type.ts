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
  Men = "men",
  Women = "women",
  ViewByCollection = "view-by-collection",
  Acetate = "acetate",
  Metal = "metal",
  Sale = "sale",
  ViewAll = "view-all",
}

export enum SunglassesView {
  Men = "men",
  Women = "women",
  ViewByCollection = "view-by-collection",
  Sale = "sale",
  ViewAll = "view-all",
}

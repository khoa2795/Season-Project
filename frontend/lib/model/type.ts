import {
  FrameMaterialEnum,
  FrameSizeEnum,
  ProductAvailabilityEnum,
  ProductGenderEnum,
  ProductTypeEnum,
} from "../enums";

export type ProductType = ProductTypeEnum;
export type ProductAvailability = ProductAvailabilityEnum;
export type ProductGender = ProductGenderEnum;
export type FrameMaterial = FrameMaterialEnum;
export type FrameSize = FrameSizeEnum;

export enum EyeglassesView {
  Acetate = "Acetate",
  Metal = "Metal",
  Big = "Big",
  Medium = "Medium",
  Small = "Small",
  Sale = "Sale",
  Bestsellers = "bestsellers",
  ViewAll = "view-all",
}

export enum SunglassesView {
  TheAthletes = "The Athletes",
  TheSoap = "The Soap",
  TheRuler = "The Ruler",
  TheCut = "The Cut",
  TheEdge = "The Edge",
  Sale = "sale",
  Bestsellers = "bestsellers",
  ViewAll = "view-all",
}

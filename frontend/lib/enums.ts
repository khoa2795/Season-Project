// These enums mirror persisted/backend string values so components and models
// can share one source of truth for comparisons and return types.
export enum ProductTypeEnum {
  Eyeglasses = "Eyeglasses",
  Sunglasses = "Sunglasses",
}

export enum ProductAvailabilityEnum {
  InStock = "in_stock",
  OutOfStock = "out_of_stock",
  PreOrder = "pre_order",
}

export enum ProductGenderEnum {
  Male = "Male",
  Female = "Female",
  Unisex = "Unisex",
}

export enum FrameMaterialEnum {
  Acetate = "Acetate",
  Metal = "Metal",
}

export enum FrameSizeEnum {
  Small = "Small",
  Medium = "Medium",
  Big = "Big",
}

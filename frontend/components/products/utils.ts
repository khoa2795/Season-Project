import { ProductTypeEnum } from "@/lib/enums";

export type ProductCategoryKey = ProductTypeEnum;

export type ProductCategoryConfig = {
  key: ProductCategoryKey;
  title: string;
  breadcrumb: string;
  tabs: string[];
};

export const productCategories: Record<
  ProductCategoryKey,
  ProductCategoryConfig
> = {
  [ProductTypeEnum.eyeglasses]: {
    key: ProductTypeEnum.eyeglasses,
    title: "Men's Eyeglasses",
    breadcrumb: "Eyeglasses",
    tabs: [
      "All Eyeglasses",
      "Metal",
      "Acetate",
      "Sale",
      "Small",
      "Medium",
      "Big",
      "Best Sellers",
    ],
  },
  [ProductTypeEnum.sunglasses]: {
    key: ProductTypeEnum.sunglasses,
    title: "Sunglasses",
    breadcrumb: "Sunglasses",
    tabs: [
      "All Sunglasses",
      "The Athletes",
      "The Soap",
      "The Ruler",
      "The Cut",
      "The Edge",
      "Best Sellers",
      "Sale",
    ],
  },
};

export const isProductCategoryKey = (
  value: ProductTypeEnum,
): value is ProductCategoryKey => {
  return (
    value === ProductTypeEnum.eyeglasses || value === ProductTypeEnum.sunglasses
  );
};

export const getProductCategoryConfig = (value: ProductTypeEnum) => {
  if (isProductCategoryKey(value)) {
    return productCategories[value];
  }

  return undefined;
};

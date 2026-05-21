import { ProductTypeEnum } from "@/lib/enums";
import { EyeglassesView, SunglassesView } from "@/lib/model/type";

export type ProductCategoryKey = ProductTypeEnum;
export type ProductCategoryFilter = {
  label: string;
  slug: EyeglassesView | SunglassesView;
};

export type ProductCollectionFilter = {
  label: string;
  slug: string;
  href: string;
  inStockCount: number;
};

export type ProductCategoryConfig = {
  key: ProductCategoryKey;
  title: string;
  breadcrumb: string;
  filters: ProductCategoryFilter[];
};

export const productCategories: Record<
  ProductCategoryKey,
  ProductCategoryConfig
> = {
  [ProductTypeEnum.eyeglasses]: {
    key: ProductTypeEnum.eyeglasses,
    title: "Eyeglasses",
    breadcrumb: "Eyeglasses",
    filters: [
      { label: "View All", slug: EyeglassesView.ViewAll },
      { label: "Women", slug: EyeglassesView.Women },
      { label: "Men", slug: EyeglassesView.Men },
      { label: "Sale", slug: EyeglassesView.Sale },
    ],
  },
  [ProductTypeEnum.sunglasses]: {
    key: ProductTypeEnum.sunglasses,
    title: "Sunglasses",
    breadcrumb: "Sunglasses",
    filters: [
      { label: "View All", slug: SunglassesView.ViewAll },
      { label: "Women", slug: SunglassesView.Women },
      { label: "Men", slug: SunglassesView.Men },
      { label: "Sale", slug: SunglassesView.Sale },
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

export const parseProductCategory = (
  value: string,
): ProductTypeEnum | undefined => {
  return Object.values(ProductTypeEnum).find((category) => category === value);
};

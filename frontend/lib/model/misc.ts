import { EyeglassesView, SunglassesView } from "./type";

export type ProductCard = {
  title: string;
  slug: string;
  image: string;
  colorCount: string;
  price: number;
  originalPrice: number;
  isOnSale: boolean;
  meta?: string;
};

export type ProductsPageData = {
  initialProducts: ProductCard[];
  totalItems: number;
  allProducts?: ProductCard[];
};

export type CollectionFilterRecord = {
  id: string;
  name: string;
  slug: string;
  inStockCount: number;
};

export const getVariantCountLabel = (count: number) => {
  if (count === 1) {
    return "1 Color";
  }

  return `${count} Colors`;
};

export const PAGE_SIZE = 12;

export function isEyeglassesSlug(value: string): value is EyeglassesView {
  return Object.values(EyeglassesView).includes(value as EyeglassesView);
}

export function isSunglassesSlug(value: string): value is SunglassesView {
  return Object.values(SunglassesView).includes(value as SunglassesView);
}

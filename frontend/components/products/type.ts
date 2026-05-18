import { ProductTypeEnum } from "@/lib/enums";
import { EyeglassesView, SunglassesView } from "@/lib/model/type";

export type ViewByCategory = {
  [ProductTypeEnum.eyeglasses]: EyeglassesView;
  [ProductTypeEnum.sunglasses]: SunglassesView;
};

export type ProductsPageProps<C extends ProductTypeEnum = ProductTypeEnum> = {
  category: C;
  view: ViewByCategory[C];
};

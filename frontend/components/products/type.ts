export type Category = "eyeglasses" | "sunglasses";

export type EyeglassesView =
  | "big"
  | "medium"
  | "small"
  | "acetate"
  | "metal"
  | "sale"
  | "bestsellers"
  | "view-all";
export type SunglassesView =
  | "The Athletes"
  | "The Soap"
  | "The Ruler"
  | "The Cut"
  | "The Edge"
  | "sale"
  | "bestsellers"
  | "view-all";

export type ViewByCategory = {
  eyeglasses: EyeglassesView;
  sunglasses: SunglassesView;
};

export type ProductsPageProps<C extends Category = Category> = {
  category: C;
  view: ViewByCategory[C];
};

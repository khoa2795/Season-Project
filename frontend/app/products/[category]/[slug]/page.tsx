import { notFound } from "next/navigation";
import { ProductTypeEnum } from "@/lib/enums";
import { getSunglassesPageData, getEyeglassesPageData } from "@/lib/model";
import {
  isEyeglassesSlug,
  isSunglassesSlug,
  ProductsPageData,
} from "@/lib/model/misc";
import { getProductCategoryConfig } from "@/components/products/utils";
import { EyeglassesView, SunglassesView } from "@/lib/model/type";
import { ProductsPageShell } from "@/components/products/products-page-shell";

type CategoryRouteProps = {
  params: Promise<{
    category: ProductTypeEnum;
    slug: SunglassesView | EyeglassesView;
  }>;
};

export default async function CategoryPage({ params }: CategoryRouteProps) {
  const { category: categoryParam, slug } = await params;
  const category =
    ProductTypeEnum[categoryParam as keyof typeof ProductTypeEnum];

  if (category === undefined) {
    notFound();
  }

  const categoryConfig = getProductCategoryConfig(category);

  if (categoryConfig === undefined) {
    notFound();
  }

  let data: ProductsPageData = {
    initialProducts: [],
    totalItems: 0,
  };

  if (category === ProductTypeEnum.eyeglasses) {
    if (!isEyeglassesSlug(slug)) {
      notFound();
    }

    data = await getEyeglassesPageData(slug);
  } else if (category === ProductTypeEnum.sunglasses) {
    if (!isSunglassesSlug(slug)) {
      notFound();
    }

    data = await getSunglassesPageData(slug);
  }

  return (
    <ProductsPageShell category={category} view={slug} initialData={data} />
  );
}

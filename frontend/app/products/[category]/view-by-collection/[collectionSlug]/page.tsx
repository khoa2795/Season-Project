import { notFound } from "next/navigation";
import { ProductTypeEnum } from "@/lib/enums";
import {
  fetchEyeglassesCollectionBatch,
  fetchSunglassesCollectionBatch,
} from "@/lib/model";
import type { ProductsPageData } from "@/lib/model/misc";
import { EyeglassesView, SunglassesView } from "@/lib/model/type";
import { ProductsPageShell } from "@/components/products/products-page-shell";
import { parseProductCategory } from "@/components/products/utils";

type CategoryCollectionRouteProps = {
  params: Promise<{
    category: string;
    collectionSlug: string;
  }>;
};

export default async function CategoryCollectionPage({
  params,
}: CategoryCollectionRouteProps) {
  const { category: categoryParam, collectionSlug } = await params;
  const category = parseProductCategory(categoryParam);

  if (category === undefined) {
    notFound();
  }

  const response =
    category === ProductTypeEnum.eyeglasses
      ? await fetchEyeglassesCollectionBatch(collectionSlug, 0)
      : await fetchSunglassesCollectionBatch(collectionSlug, 0);

  if (response.total === 0) {
    notFound();
  }

  const view =
    category === ProductTypeEnum.eyeglasses
      ? EyeglassesView.ViewByCollection
      : SunglassesView.ViewByCollection;

  const data: ProductsPageData = {
    initialProducts: response.records,
    totalItems: response.total,
  };

  return (
    <ProductsPageShell
      category={category}
      view={view}
      collectionSlug={collectionSlug}
      initialData={data}
    />
  );
}

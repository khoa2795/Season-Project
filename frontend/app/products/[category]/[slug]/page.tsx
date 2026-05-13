import { notFound } from "next/navigation";
import { ProductsPage } from "@/components/products/products-page";
import { getProductCategoryConfig } from "@/components/products/products-data";
import {
  Category,
  SunglassesView,
  EyeglassesView,
} from "@/components/products/type";

type CategoryRouteProps = {
  params: Promise<{
    category: Category;
    slug: SunglassesView | EyeglassesView;
  }>;
};

export default async function CategoryPage({ params }: CategoryRouteProps) {
  const { category, slug } = await params;

  const categoryConfig = getProductCategoryConfig(category);

  if (categoryConfig === undefined) {
    notFound();
  }
  return <ProductsPage category={category} view={slug} />;
}

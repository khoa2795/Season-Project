import { notFound, redirect } from "next/navigation";
import { getProductCategoryConfig } from "@/components/products/products-data";

type CategoryRouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryRouteProps) {
  const { category } = await params;
  const categoryConfig = getProductCategoryConfig(category);

  if (categoryConfig === undefined) {
    notFound();
  }

  redirect(`/products/${category}/view-all`);
}

import { notFound, redirect } from "next/navigation";
import { getProductCategoryConfig } from "@/components/products/utils";
import { ProductTypeEnum } from "@/lib/enums";

type CategoryRouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryRouteProps) {
  const { category: categoryParam } = await params;
  const category =
    ProductTypeEnum[categoryParam as keyof typeof ProductTypeEnum];

  if (category === undefined) {
    console.error(`Invalid category: ${categoryParam}`);
    notFound();
  }

  const categoryConfig = getProductCategoryConfig(category);

  if (categoryConfig === undefined) {
    notFound();
  }

  redirect(`/products/${categoryParam}/view-all`);
}

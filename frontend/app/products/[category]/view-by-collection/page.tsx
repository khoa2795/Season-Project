import { notFound, redirect } from "next/navigation";
import { fetchCollectionFilters } from "@/lib/model";
import { parseProductCategory } from "@/components/products/utils";

type CategoryCollectionLandingRouteProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryCollectionLandingPage({
  params,
}: CategoryCollectionLandingRouteProps) {
  const { category: categoryParam } = await params;
  const category = parseProductCategory(categoryParam);

  if (category === undefined) {
    notFound();
  }

  const collections = await fetchCollectionFilters(category);
  const firstCollection = collections[0];

  if (firstCollection === undefined) {
    notFound();
  }

  redirect(`/products/${category}/view-by-collection/${firstCollection.slug}`);
}

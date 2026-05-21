import { notFound } from "next/navigation";
import { getCollectionPageData, fetchCollectionFilters } from "@/lib/model";
import { ProductsPageShell } from "@/components/products/products-page-shell";
import { ProductTypeEnum } from "@/lib/enums";
import { EyeglassesView } from "@/lib/model/type";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  const collections = await fetchCollectionFilters();
  const matchedCollection = collections.find((collection) => collection.slug === slug);

  if (matchedCollection === undefined) {
    notFound();
  }

  const data = await getCollectionPageData(slug);

  return (
    <ProductsPageShell
      category={ProductTypeEnum.eyeglasses}
      view={EyeglassesView.Women}
      collectionSlug={slug}
      initialData={data}
    />
  );
}

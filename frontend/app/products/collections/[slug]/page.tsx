import { notFound } from "next/navigation";
import { getCollectionPageData, fetchCollectionFilters } from "@/lib/model";
import { CollectionListShell } from "@/components/products/view-by-collection/collection-list-shell";
import {
  parseProductsQueryState,
  toPlainObject,
} from "@/lib/model/misc";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const queryState = parseProductsQueryState({
    sort: getSingleSearchParam(queryParams.sort),
  });

  const collections = await fetchCollectionFilters();
  const matchedCollection = collections.find((collection) => collection.slug === slug);

  if (matchedCollection === undefined) {
    notFound();
  }

  const collectionProducts = await getCollectionPageData(slug, queryState.sort);

  return (
    <CollectionListShell
      collectionSlug={slug}
      initialData={toPlainObject(collectionProducts)}
    />
  );
}

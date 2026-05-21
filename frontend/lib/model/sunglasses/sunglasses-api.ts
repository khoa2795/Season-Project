import { fetchList, ListResponse } from "@/lib/fetcher";
import { ProductGenderEnum } from "@/lib/enums";
import {
  SunglassesProduct,
  type SunglassesQuery,
  serializeSunglassesQuery,
} from "@/lib/model";
import { serializePaginationQuery } from "@/lib/serialize";
import { SunglassesView } from "../type";
import {
  getVariantCountLabel,
  ProductCard,
  ProductsPageData,
  PAGE_SIZE,
} from "../misc";

const toSunglassesCard = (product: SunglassesProduct): ProductCard => ({
  title: product.name,
  slug: product.slug,
  image: product.primaryImage,
  colorCount: getVariantCountLabel(product.variants.length),
  price: product.price,
  originalPrice: product.originalPrice,
  isOnSale: product.isOnSale,
  meta: product.brand,
});

function getSunglassesQueryByView(view: SunglassesView): SunglassesQuery {
  if (view === SunglassesView.Men) {
    return { gender: ProductGenderEnum.Male };
  }

  if (view === SunglassesView.Women) {
    return { gender: ProductGenderEnum.Female };
  }

  if (view === SunglassesView.Sale) {
    return { sale: true };
  }

  return {};
}

async function fetchSunglassesPage(
  query: SunglassesQuery,
  offset: number,
  limit: number,
): Promise<ListResponse<SunglassesProduct>> {
  return fetchList("/sunglasses", SunglassesProduct, {
    ...serializeSunglassesQuery(query),
    ...serializePaginationQuery({ offset, limit }),
  });
}

export async function fetchSunglassesBatch(
  view: SunglassesView,
  offset: number,
  limit: number = PAGE_SIZE,
): Promise<ListResponse<ProductCard>> {
  const response = await fetchSunglassesPage(
    getSunglassesQueryByView(view),
    offset,
    limit,
  );

  return {
    records: response.records.map(toSunglassesCard),
    total: response.total,
  };
}

export async function getSunglassesPageData(
  view: SunglassesView,
): Promise<ProductsPageData> {
  const response = await fetchSunglassesBatch(view, 0, PAGE_SIZE);

  return {
    initialProducts: response.records,
    totalItems: response.total,
  };
}

export async function fetchSunglassesCollectionBatch(
  collectionSlug: string,
  offset: number,
  limit: number = PAGE_SIZE,
): Promise<ListResponse<ProductCard>> {
  const response = await fetchSunglassesPage({ collectionSlug }, offset, limit);

  return {
    records: response.records.map(toSunglassesCard),
    total: response.total,
  };
}

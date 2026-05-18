import { fetchList, type ListResponse } from "@/lib/fetcher";
import { FrameMaterialEnum, FrameSizeEnum } from "@/lib/enums";
import {
  EyeglassesProduct,
  serializeEyeglassesQuery,
  EyeglassesQuery,
} from "@/lib/model";
import { serializePaginationQuery } from "@/lib/serialize";
import { EyeglassesView } from "../type";
import {
  ProductCard,
  ProductsPageData,
  getVariantCountLabel,
  PAGE_SIZE,
} from "../misc";

const toEyeglassesCard = (product: EyeglassesProduct): ProductCard => ({
  title: product.name,
  slug: product.slug,
  image: product.primaryImage,
  colorCount: getVariantCountLabel(product.variants.length),
  price: product.price,
  originalPrice: product.originalPrice,
  isOnSale: product.isOnSale,
  meta: `${product.frameSize} / ${product.frameMaterial}`,
});

function getEyeglassesQueryByView(view: EyeglassesView): EyeglassesQuery {
  const normalizedView = String(view).toLowerCase();

  if (normalizedView === "acetate") {
    return { frameType: FrameMaterialEnum.Acetate };
  }

  if (normalizedView === "metal") {
    return { frameType: FrameMaterialEnum.Metal };
  }

  if (normalizedView === "small") {
    return { frameSize: FrameSizeEnum.Small };
  }

  if (normalizedView === "medium") {
    return { frameSize: FrameSizeEnum.Medium };
  }

  if (normalizedView === "big") {
    return { frameSize: FrameSizeEnum.Big };
  }

  return {};
}

async function fetchEyeglassesPage(
  query: EyeglassesQuery,
  offset: number,
  limit: number,
): Promise<ListResponse<EyeglassesProduct>> {
  return fetchList("/eyeglasses", EyeglassesProduct, {
    ...serializeEyeglassesQuery(query),
    ...serializePaginationQuery({ offset, limit }),
  });
}

export async function fetchEyeglassesBatch(
  view: EyeglassesView,
  offset: number,
  limit: number = PAGE_SIZE,
): Promise<ListResponse<ProductCard>> {
  const response = await fetchEyeglassesPage(
    getEyeglassesQueryByView(view),
    offset,
    limit,
  );

  return {
    records: response.records.map(toEyeglassesCard),
    total: response.total,
  };
}

export async function getEyeglassesPageData(
  view: EyeglassesView,
): Promise<ProductsPageData> {
  const response = await fetchEyeglassesBatch(view, 0, PAGE_SIZE);

  return {
    initialProducts: response.records,
    totalItems: response.total,
  };
}

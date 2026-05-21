import { Eyeglasses } from "../models/Eyeglasses.js";
import type {
  DatabaseEyeglassesProduct,
  EyeglassesProductResponse,
  EyeglassesResponseData,
  ValidatedEyeglassesQuery,
} from "../types/eyewear.js";

function buildFilter(query: ValidatedEyeglassesQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    isActive: true,
  };

  if (query.frameType !== null) {
    filter["specifications.frameType.material"] = query.frameType;
  }

  if (query.frameSize !== null) {
    filter["specifications.frameType.size"] = query.frameSize;
  }

  if (query.sale === true) {
    filter.salePercent = { $gt: 0 };
  }

  return filter;
}

function buildSortOrder(
  sort: "price_asc" | "price_desc" | "name_asc" | "newest" | "rating_desc",
): Record<string, 1 | -1> {
  switch (sort) {
    case "price_asc":
      return { "variants.price": 1 };
    case "price_desc":
      return { "variants.price": -1 };
    case "name_asc":
      return { name: 1 };
    case "newest":
      return { _id: -1 };
    case "rating_desc":
      return { "rating.avg": -1, "rating.count": -1 };
    default:
      return { _id: -1 };
  }
}

function transformEyeglassesProduct(
  product: DatabaseEyeglassesProduct,
): EyeglassesProductResponse {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    type: product.type,
    collectionId: product.collectionId.toString(),
    brand: product.brand,
    salePercent: product.salePercent,
    availability: product.availability,
    description: product.description,
    specifications: product.specifications,
    variants: product.variants,
    rating: product.rating,
    isActive: product.isActive,
  };
}

export async function getEyeglassesByFilters(
  query: ValidatedEyeglassesQuery,
): Promise<EyeglassesResponseData> {
  try {
    const filter = buildFilter(query);
    const sortOrder = buildSortOrder(query.sort);
    const total = await Eyeglasses.countDocuments(filter);

    const products = await Eyeglasses.find(filter)
      .select(
        "name slug type collectionId brand salePercent availability description specifications variants rating isActive",
      )
      .sort(sortOrder)
      .skip(query.offset)
      .limit(query.limit)
      .lean<DatabaseEyeglassesProduct[]>();

    return {
      records: products.map(transformEyeglassesProduct),
      total,
    };
  } catch (error) {
    console.error("Error fetching eyeglasses:", error);
    throw new Error("Failed to fetch eyeglasses");
  }
}

import { Collection } from "../models/Collection.js";
import { Sunglasses } from "../models/Sunglasses.js";
import type {
  DatabaseSunglassesProduct,
  SunglassesProductResponse,
  SunglassesResponseData,
  ValidatedSunglassesQuery,
} from "../types/eyewear.js";

function transformSunglassesProduct(
  product: DatabaseSunglassesProduct,
): SunglassesProductResponse {
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

export async function getSunglassesByFilters(
  query: ValidatedSunglassesQuery,
): Promise<SunglassesResponseData> {
  try {
    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (query.collectionSlug !== null) {
      const collection = await Collection.findOne({
        slug: query.collectionSlug,
      })
        .select("_id")
        .lean<{ _id: unknown } | null>();

      if (collection === null) {
        return {
          records: [],
          total: 0,
        };
      }

      filter.collectionId = collection._id;
    }

    if (query.sale === true) {
      filter.salePercent = { $gt: 0 };
    }

    const sortOrder = buildSortOrder(query.sort);
    const total = await Sunglasses.countDocuments(filter);

    const products = await Sunglasses.find(filter)
      .select(
        "name slug type collectionId brand salePercent availability description specifications variants rating isActive",
      )
      .sort(sortOrder)
      .skip(query.offset)
      .limit(query.limit)
      .lean<DatabaseSunglassesProduct[]>();

    return {
      records: products.map(transformSunglassesProduct),
      total,
    };
  } catch (error) {
    console.error("Error fetching sunglasses:", error);
    throw new Error("Failed to fetch sunglasses");
  }
}

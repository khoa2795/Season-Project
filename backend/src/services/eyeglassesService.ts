import { Eyeglasses } from "../models/Eyeglasses.js";
import type {
  DatabaseProduct,
  EyewearResponseData,
  ValidatedEyeglassesQuery,
} from "../types/eyewear.js";
import { transformProduct } from "./eyewearServiceShared.js";

function buildFilter(query: ValidatedEyeglassesQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    isActive: true,
  };

  if (query.frameType) {
    filter["specifications.frameType.material"] = query.frameType;
  }

  return filter;
}

export async function getEyeglassesByFilters(
  query: ValidatedEyeglassesQuery,
): Promise<EyewearResponseData> {
  try {
    const filter = buildFilter(query);
    const total = await Eyeglasses.countDocuments(filter);

    const products = await Eyeglasses.find(filter)
      .select("name slug type brand availability rating variants")
      .skip(query.offset)
      .limit(query.limit)
      .lean<DatabaseProduct[]>();

    return {
      products: products.map(transformProduct),
      pagination: {
        offset: query.offset,
        limit: query.limit,
        total,
        hasMore: query.offset + query.limit < total,
      },
    };
  } catch (error) {
    console.error("Error fetching eyeglasses:", error);
    throw new Error("Failed to fetch eyeglasses");
  }
}

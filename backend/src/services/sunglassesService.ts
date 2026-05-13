import { Sunglasses } from "../models/Sunglasses.js";
import type {
  DatabaseProduct,
  EyewearResponseData,
  ValidatedSunglassesQuery,
} from "../types/eyewear.js";
import { transformProduct } from "./eyewearServiceShared.js";

export async function getSunglassesByFilters(
  query: ValidatedSunglassesQuery,
): Promise<EyewearResponseData> {
  try {
    const filter = { isActive: true };
    const total = await Sunglasses.countDocuments(filter);

    const products = await Sunglasses.find(filter)
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
    console.error("Error fetching sunglasses:", error);
    throw new Error("Failed to fetch sunglasses");
  }
}

import type { Response } from "express";
import { getCollectionFilters as getCollectionFiltersData } from "../services/collectionsService.js";
import type {
  CollectionFiltersResponseData,
  ErrorResponse,
} from "../types/eyewear.js";
import type { Request } from "express";

export async function getCollectionFilters(
  _req: Request,
  res: Response<CollectionFiltersResponseData | ErrorResponse>,
): Promise<void> {
  try {
    const responseData = await getCollectionFiltersData();
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getCollectionFilters controller:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

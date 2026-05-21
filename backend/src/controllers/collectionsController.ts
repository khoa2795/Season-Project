import type { Response } from "express";
import { getCollectionFiltersByProductType } from "../services/collectionsService.js";
import type {
  CollectionFiltersResponseData,
  ErrorResponse,
} from "../types/eyewear.js";
import type { CollectionFiltersValidatedRequest } from "../middleware/validation.js";

export async function getCollectionFilters(
  req: CollectionFiltersValidatedRequest,
  res: Response<CollectionFiltersResponseData | ErrorResponse>,
): Promise<void> {
  try {
    const validatedQuery = req.validatedQuery;

    if (validatedQuery === undefined) {
      res.status(400).json({
        error: "Invalid query parameters",
      });
      return;
    }

    const responseData = await getCollectionFiltersByProductType(validatedQuery);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getCollectionFilters controller:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

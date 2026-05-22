import type { Response } from "express";
import {
  getCollectionFilters as getCollectionFiltersData,
  getCollectionProductsBySlug,
} from "../services/collectionsService.js";
import type {
  CollectionFiltersResponseData,
  CollectionProductsResponseData,
  ErrorResponse,
} from "../types/eyewear.js";

import type { CollectionFiltersValidatedRequest } from "../middleware/validation.js";
import { AppError } from "../errors/AppError.js";

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


  const responseData = await getCollectionFiltersByProductType(validatedQuery);
  res.status(200).json(responseData);
}

export async function getCollectionProducts(
  req: CollectionProductsValidatedRequest,
  res: Response<CollectionProductsResponseData | ErrorResponse>,
): Promise<void> {
  try {
    const slug = req.params.slug;
    const query = req.validatedQuery;

    if (slug === undefined || Array.isArray(slug) || query === undefined) {
      res.status(400).json({ error: "Missing collection slug or query." });
      return;
    }

    const responseData = await getCollectionProductsBySlug(slug, query);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getCollectionProducts controller:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

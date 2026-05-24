import type { Response } from "express";
import {
  getCollectionFilters as getCollectionFiltersData,
  getCollectionProductsBySlug,
} from "../services/collectionsService.js";
import type {
  CollectionFiltersResponseData,
  ErrorResponse,
  ProductsResponseData,
} from "../types/eyewear.js";
import type { Request } from "express";
import type { CollectionProductsValidatedRequest } from "../middleware/validation.js";

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

export async function getCollectionProducts(
  req: CollectionProductsValidatedRequest,
  res: Response<ProductsResponseData | ErrorResponse>,
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

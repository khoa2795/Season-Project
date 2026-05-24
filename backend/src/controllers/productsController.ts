import mongoose from "mongoose";
import type { Response } from "express";
import {
  getProductById,
  getProductsByFilters,
} from "../services/productsService.js";
import type {
  ErrorResponse,
  ProductResponse,
  ProductsResponseData,
} from "../types/eyewear.js";
import type { ProductValidatedRequest } from "../middleware/validation.js";

export async function getProducts(
  req: ProductValidatedRequest,
  res: Response<ProductsResponseData | ErrorResponse>,
): Promise<void> {
  try {
    const validatedQuery = req.validatedQuery;

    if (validatedQuery === undefined) {
      res.status(400).json({
        error: "Invalid query parameters",
      });
      return;
    }

    const responseData = await getProductsByFilters(validatedQuery);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getProducts controller:", error);

    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function getProduct(
  req: { params: { id?: string } },
  res: Response<ProductResponse | ErrorResponse>,
): Promise<void> {
  try {
    const id = req.params.id;

    if (id === undefined || id.trim() === "") {
      res.status(404).json({
        error: "Product not found",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        error: "Product not found",
      });
      return;
    }

    const product = await getProductById(id);

    if (product === null) {
      res.status(404).json({
        error: "Product not found",
      });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProduct controller:", error);

    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

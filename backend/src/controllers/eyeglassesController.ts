import type { Response } from "express";
import { getEyeglassesByFilters } from "../services/eyeglassesService.js";
import type { ApiResponse, EyewearResponseData } from "../types/eyewear.js";
import type { EyeglassesValidatedRequest } from "../middleware/validation.js";

export async function getEyeglasses(
  req: EyeglassesValidatedRequest,
  res: Response<ApiResponse<EyewearResponseData>>,
): Promise<void> {
  try {
    const validatedQuery = req.validatedQuery;

    if (!validatedQuery) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
      });
      return;
    }

    const responseData = await getEyeglassesByFilters(validatedQuery);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getEyeglasses controller:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

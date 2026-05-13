import type { Response } from "express";
import { getSunglassesByFilters } from "../services/sunglassesService.js";
import type { ApiResponse, EyewearResponseData } from "../types/eyewear.js";
import type { SunglassesValidatedRequest } from "../middleware/validation.js";

export async function getSunglasses(
  req: SunglassesValidatedRequest,
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

    const responseData = await getSunglassesByFilters(validatedQuery);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getSunglasses controller:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

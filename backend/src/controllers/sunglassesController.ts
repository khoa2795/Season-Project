import type { Response } from "express";
import { getSunglassesByFilters } from "../services/sunglassesService.js";
import type {
  ErrorResponse,
  SunglassesResponseData,
} from "../types/eyewear.js";
import type { SunglassesValidatedRequest } from "../middleware/validation.js";

export async function getSunglasses(
  req: SunglassesValidatedRequest,
  res: Response<SunglassesResponseData | ErrorResponse>,
): Promise<void> {
  try {
    const validatedQuery = req.validatedQuery;

    if (validatedQuery === undefined) {
      res.status(400).json({
        error: "Invalid query parameters",
      });
      return;
    }

    const responseData = await getSunglassesByFilters(validatedQuery);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in getSunglasses controller:", error);

    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

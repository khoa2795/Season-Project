import type { Response } from "express";
import { getSunglassesByFilters } from "../services/sunglassesService.js";
import type {
  ErrorResponse,
  SunglassesResponseData,
} from "../types/eyewear.js";
import type { SunglassesValidatedRequest } from "../middleware/validation.js";
import { AppError } from "../errors/AppError.js";

export async function getSunglasses(
  req: SunglassesValidatedRequest,
  res: Response<SunglassesResponseData | ErrorResponse>,
): Promise<void> {
  const validatedQuery = req.validatedQuery;

  if (validatedQuery === undefined) {
    throw AppError.badRequest("Invalid query parameters");
  }

  const responseData = await getSunglassesByFilters(validatedQuery);

  res.status(200).json(responseData);
}

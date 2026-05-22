import type { Response } from "express";
import { getEyeglassesByFilters } from "../services/eyeglassesService.js";
import type {
  ErrorResponse,
  EyeglassesResponseData,
} from "../types/eyewear.js";
import type { EyeglassesValidatedRequest } from "../middleware/validation.js";
import { AppError } from "../errors/AppError.js";

export async function getEyeglasses(
  req: EyeglassesValidatedRequest,
  res: Response<EyeglassesResponseData | ErrorResponse>,
): Promise<void> {
  const validatedQuery = req.validatedQuery;

  if (validatedQuery === undefined) {
    throw AppError.badRequest("Invalid query parameters");
  }

  const responseData = await getEyeglassesByFilters(validatedQuery);

  res.status(200).json(responseData);
}

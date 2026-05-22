import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { AdminTopProductsQuery } from "../types/admin.js";

export interface AdminTopProductsValidatedRequest extends Request {
  validatedTopProductsQuery?: AdminTopProductsQuery;
}

export function validateTopProductsQuery(
  req: AdminTopProductsValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const rawLimit = req.query.limit;

  if (rawLimit === undefined) {
    req.validatedTopProductsQuery = { limit: 10 };
    next();
    return;
  }

  if (typeof rawLimit !== "string" || rawLimit.trim() === "") {
    next(AppError.badRequest("limit is invalid", "VALIDATION_ERROR"));
    return;
  }

  const limit = Number.parseInt(rawLimit, 10);

  if (Number.isInteger(limit) === false || limit < 1) {
    next(AppError.badRequest("limit is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedTopProductsQuery = {
    limit: Math.min(limit, 50),
  };
  next();
}

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { FrameMaterial } from "../models/Eyeglasses.js";
import type {
  CollectionProductsQueryParams,
  EyeglassesQueryParams,
  SunglassesQueryParams,
  ValidatedCollectionProductsQuery,
  ValidatedEyeglassesQuery,
  ValidatedSunglassesQuery,
} from "../types/eyewear.js";

export interface EyeglassesValidatedRequest extends Request {
  validatedQuery?: ValidatedEyeglassesQuery;
}

export interface SunglassesValidatedRequest extends Request {
  validatedQuery?: ValidatedSunglassesQuery;
}

export interface CollectionProductsValidatedRequest extends Request {
  validatedQuery?: ValidatedCollectionProductsQuery;
}

export const parsePagination = (query: {
  offset?: number | string;
  limit?: number | string;
}) => {
  const offset = parseInt(query.offset as string) || 0;
  let limit = parseInt(query.limit as string) || 12;

  if (offset < 0) {
    return { error: "Offset must be a non-negative number" };
  }

  if (limit < 1) {
    return { error: "Limit must be at least 1" };
  }

  if (limit > 100) {
    limit = 100;
  }

  return {
    offset,
    limit,
  };
};

const parseSaleParam = (
  saleParam?: string,
): { sale: boolean } | { error: string } => {
  if (saleParam === undefined) {
    return { sale: false };
  }

  const normalized = saleParam.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) {
    return { sale: true };
  }

  if (["false", "0", "no"].includes(normalized)) {
    return { sale: false };
  }

  return { error: "Invalid sale. Use true or false." };
};

export const parseSortParam = (
  sortParam?: string,
):
  | { sort: ValidatedEyeglassesQuery["sort"] }
  | { error: string } => {
  if (sortParam === undefined) {
    return { sort: DEFAULT_PRODUCT_SORT };
  }

  if (PRODUCT_SORTS.includes(sortParam as ValidatedEyeglassesQuery["sort"])) {
    return { sort: sortParam as ValidatedEyeglassesQuery["sort"] };
  }

  return { error: "Invalid sort." };
};

const parseGenderParam = (
  genderParam?: string,
): { gender: "Male" | "Female" | null } | { error: string } => {
  if (genderParam === undefined) {
    return { gender: null };
  }

  const normalized = genderParam.trim().toLowerCase();

  if (normalized === "male" || normalized === "men") {
    return { gender: "Male" };
  }

  if (normalized === "female" || normalized === "women") {
    return { gender: "Female" };
  }

  return { error: "Invalid gender. Use Male or Female." };
};

const normalizeCollectionSlug = (value?: string): string | null => {
  if (value === undefined) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized === "" ? null : normalized;
};

export const validateCollectionProductsQuery = (
  req: CollectionProductsValidatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const query = req.query as CollectionProductsQueryParams;
  const pagination = parsePagination(query);

  if ("error" in pagination) {
    res.status(400).json({ error: pagination.error });
    return;
  }

  const sort = parseSortParam(query.sort);

  if ("error" in sort) {
    res.status(400).json({ error: sort.error });
    return;
  }

  req.validatedQuery = {
    ...pagination,
    sort: sort.sort,
  };

  next();
};

export const validateEyeglassesQuery = (
  req: EyeglassesValidatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const query = req.query as EyeglassesQueryParams;
  const pagination = parsePagination(query);

  if ("error" in pagination) {
    next(AppError.badRequest(pagination.error, "VALIDATION_ERROR"));
    return;
  }

  const frameType =
    FrameMaterial[query.frameType as keyof typeof FrameMaterial] || null;
  const frameSize = FrameSize[query.frameSize as keyof typeof FrameSize] || null;

  if (query.frameType && frameType === null) {
    next(AppError.badRequest("Invalid frameType.", "VALIDATION_ERROR"));
    return;
  }

  const sale = parseSaleParam(query.sale);
  if ("error" in sale) {
    next(AppError.badRequest(sale.error, "VALIDATION_ERROR"));
    return;
  }

  const gender = parseGenderParam(query.gender);
  if ("error" in gender) {
    next(AppError.badRequest(gender.error, "VALIDATION_ERROR"));
    return;
  }

  req.validatedQuery = {
    frameType: frameType,
    frameSize: frameSize,
    collectionSlug: normalizeCollectionSlug(query.collectionSlug),
    gender: gender.gender,
    sale: sale.sale,
    sort: sort.sort,
    offset: pagination.offset,
    limit: pagination.limit,
  };

  next();
};

export const validateSunglassesQuery = (
  req: SunglassesValidatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const query = req.query as SunglassesQueryParams;
  const pagination = parsePagination(query);

  if ("error" in pagination) {
    next(AppError.badRequest(pagination.error, "VALIDATION_ERROR"));
    return;
  }

  const sale = parseSaleParam(query.sale);
  if ("error" in sale) {
    next(AppError.badRequest(sale.error, "VALIDATION_ERROR"));
    return;
  }

  const gender = parseGenderParam(query.gender);
  if ("error" in gender) {
    next(AppError.badRequest(gender.error, "VALIDATION_ERROR"));
    return;
  }

  const collectionSlug = normalizeCollectionSlug(query.collectionSlug);
  const sort = parseSortParam(query.sort);

  if ("error" in sort) {
    res.status(400).json({ error: sort.error });
    return;
  }

  req.validatedQuery = {
    collectionSlug,
    gender: gender.gender,
    ...pagination,
    sale: sale.sale,
  };
  next();
};

export const validateCollectionFiltersQuery = (
  req: CollectionFiltersValidatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const query = req.query as CollectionFiltersQueryParams;
  const productType = query.productType?.trim().toLowerCase();

  if (
    productType !== PRODUCT_TYPE_VALUES.eyeglasses &&
    productType !== PRODUCT_TYPE_VALUES.sunglasses
  ) {
    next(AppError.badRequest("Invalid productType.", "VALIDATION_ERROR"));
    return;
  }

  req.validatedQuery = {
    productType,
  };
  next();
};

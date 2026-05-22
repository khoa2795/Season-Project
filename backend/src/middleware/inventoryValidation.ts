import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type {
  InventoryCheckQuery,
  InventoryListQuery,
  InventoryStockUpdateInput,
} from "../types/inventory.js";
import { readObjectId } from "./validationReaders.js";

interface JsonBodyRequest extends Request {
  body: unknown;
}

export interface InventoryValidatedRequest extends Request {
  validatedInventoryListQuery?: InventoryListQuery;
  validatedInventoryCheckQuery?: InventoryCheckQuery;
  validatedInventorySku?: string;
  validatedInventoryStockUpdate?: InventoryStockUpdateInput;
}

function readSku(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value.trim();
}

function readPositiveQueryInteger(
  value: unknown,
  fallback: number,
  max: number,
): number | null {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isInteger(parsed) === false || parsed < 1) {
    return null;
  }

  return Math.min(parsed, max);
}

function readLowStock(value: unknown): boolean | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return null;
}

export function validateInventoryListQuery(
  req: InventoryValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const productId =
    req.query.productId === undefined
      ? undefined
      : readObjectId(req.query.productId);
  const lowStock = readLowStock(req.query.lowStock);
  const page = readPositiveQueryInteger(req.query.page, 1, 1_000_000);
  const limit = readPositiveQueryInteger(req.query.limit, 20, 100);

  if (productId === null) {
    next(AppError.badRequest("productId is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (lowStock === null || page === null || limit === null) {
    next(AppError.badRequest("Inventory query is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedInventoryListQuery = {
    ...(productId === undefined ? {} : { productId }),
    ...(lowStock === undefined ? {} : { lowStock }),
    page,
    limit,
  };
  next();
}

export function validateInventoryCheckQuery(
  req: InventoryValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const sku = readSku(req.query.sku);
  const quantity =
    typeof req.query.quantity === "string"
      ? Number.parseInt(req.query.quantity, 10)
      : Number.NaN;

  if (sku === null) {
    next(AppError.badRequest("sku is required", "VALIDATION_ERROR"));
    return;
  }

  if (Number.isInteger(quantity) === false || quantity < 1) {
    next(
      AppError.badRequest(
        "quantity must be a positive integer",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  req.validatedInventoryCheckQuery = {
    sku,
    quantity,
  };
  next();
}

export function validateInventorySkuParam(
  req: InventoryValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const sku = readSku(req.params.sku);

  if (sku === null) {
    next(AppError.badRequest("sku is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedInventorySku = sku;
  next();
}

export function validateInventoryStockBody(
  req: InventoryValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  if (typeof req.body !== "object" || req.body === null) {
    next(AppError.badRequest("Invalid inventory payload", "VALIDATION_ERROR"));
    return;
  }

  const sku = req.validatedInventorySku;
  const stock = (req.body as Record<string, unknown>).stock;

  if (sku === undefined) {
    next(AppError.badRequest("sku is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (
    typeof stock !== "number" ||
    Number.isInteger(stock) === false ||
    stock < 0
  ) {
    next(AppError.badRequest("stock is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedInventoryStockUpdate = {
    sku,
    stock,
  };
  next();
}

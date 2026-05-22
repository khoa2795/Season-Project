import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { readObjectId } from "./validationReaders.js";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../types/category.js";

interface JsonBodyRequest extends Request {
  body: unknown;
}

export interface CategoryIdValidatedRequest extends Request {
  validatedCategoryId?: string;
}

export interface CategoryCreateValidatedRequest extends Request {
  validatedCategoryCreateBody?: CategoryCreateInput;
}

export interface CategoryUpdateValidatedRequest extends Request {
  validatedCategoryUpdateBody?: CategoryUpdateInput;
}

function hasOwn(record: Record<string, unknown>, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, field);
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

function readRequiredSlug(value: unknown): string | null {
  const slug = readRequiredString(value);

  if (slug === null) {
    return null;
  }

  const normalized = normalizeSlug(slug);
  return normalized === "" ? null : normalized;
}

function readOptionalString(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  return readRequiredString(value);
}

function readOptionalObjectId(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  return readObjectId(value);
}

function readOptionalBoolean(value: unknown): boolean | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "boolean" ? value : null;
}

function readOptionalOrder(value: unknown): number | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (
    typeof value !== "number" ||
    Number.isInteger(value) === false ||
    value < 0
  ) {
    return null;
  }

  return value;
}

export function validateCategoryIdParam(
  req: CategoryIdValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const categoryId = readObjectId(req.params.categoryId);

  if (categoryId === null) {
    next(AppError.badRequest("categoryId is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedCategoryId = categoryId;
  next();
}

export function validateCreateCategoryBody(
  req: CategoryCreateValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  if (typeof req.body !== "object" || req.body === null) {
    next(AppError.badRequest("Invalid category payload", "VALIDATION_ERROR"));
    return;
  }

  const body = req.body as Record<string, unknown>;
  const name = readRequiredString(body.name);
  const slug =
    body.slug === undefined
      ? name === null
        ? null
        : readRequiredSlug(name)
      : readRequiredSlug(body.slug);
  const description = readOptionalString(body.description);
  const parentCategoryId = readOptionalObjectId(body.parentCategoryId);
  const order = readOptionalOrder(body.order);
  const isActive = readOptionalBoolean(body.isActive);

  if (name === null) {
    next(AppError.badRequest("name is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (slug === null) {
    next(AppError.badRequest("slug is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (description === null) {
    next(AppError.badRequest("description is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (parentCategoryId === null) {
    next(
      AppError.badRequest("parentCategoryId is invalid", "VALIDATION_ERROR"),
    );
    return;
  }

  if (order === null) {
    next(AppError.badRequest("order is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (isActive === null) {
    next(AppError.badRequest("isActive is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedCategoryCreateBody = {
    name,
    slug,
    ...(description === undefined ? {} : { description }),
    ...(parentCategoryId === undefined ? {} : { parentCategoryId }),
    ...(order === undefined ? {} : { order }),
    ...(isActive === undefined ? {} : { isActive }),
  };
  next();
}

export function validateUpdateCategoryBody(
  req: CategoryUpdateValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  if (typeof req.body !== "object" || req.body === null) {
    next(AppError.badRequest("Invalid category payload", "VALIDATION_ERROR"));
    return;
  }

  const body = req.body as Record<string, unknown>;
  const validatedBody: CategoryUpdateInput = {};

  if (hasOwn(body, "name")) {
    const name = readRequiredString(body.name);

    if (name === null) {
      next(AppError.badRequest("name is invalid", "VALIDATION_ERROR"));
      return;
    }

    validatedBody.name = name;
  }

  if (hasOwn(body, "slug")) {
    const slug = readRequiredSlug(body.slug);

    if (slug === null) {
      next(AppError.badRequest("slug is invalid", "VALIDATION_ERROR"));
      return;
    }

    validatedBody.slug = slug;
  }

  if (hasOwn(body, "description")) {
    if (body.description === null) {
      validatedBody.description = null;
    } else {
      const description = readRequiredString(body.description);

      if (description === null) {
        next(
          AppError.badRequest("description is invalid", "VALIDATION_ERROR"),
        );
        return;
      }

      validatedBody.description = description;
    }
  }

  if (hasOwn(body, "parentCategoryId")) {
    if (body.parentCategoryId === null) {
      validatedBody.parentCategoryId = null;
    } else {
      const parentCategoryId = readOptionalObjectId(body.parentCategoryId);

      if (parentCategoryId === undefined || parentCategoryId === null) {
        next(
          AppError.badRequest(
            "parentCategoryId is invalid",
            "VALIDATION_ERROR",
          ),
        );
        return;
      }

      validatedBody.parentCategoryId = parentCategoryId;
    }
  }

  if (hasOwn(body, "isActive")) {
    const isActive = readOptionalBoolean(body.isActive);

    if (isActive === undefined || isActive === null) {
      next(AppError.badRequest("isActive is invalid", "VALIDATION_ERROR"));
      return;
    }

    validatedBody.isActive = isActive;
  }

  if (hasOwn(body, "order")) {
    const order = readOptionalOrder(body.order);

    if (order === undefined || order === null) {
      next(AppError.badRequest("order is invalid", "VALIDATION_ERROR"));
      return;
    }

    validatedBody.order = order;
  }

  if (Object.keys(validatedBody).length === 0) {
    next(
      AppError.badRequest(
        "Provide at least one category field to update",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  req.validatedCategoryUpdateBody = validatedBody;
  next();
}

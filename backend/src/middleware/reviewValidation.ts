import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { CreateReviewInput, UpdateReviewInput } from "../types/review.js";
import {
  readObjectId,
  readPositiveInteger,
} from "./validationReaders.js";

interface JsonBodyRequest extends Request {
  body: unknown;
}

export interface CreateReviewValidatedRequest extends Request {
  validatedReviewCreateBody?: CreateReviewInput;
}

export interface ReviewIdValidatedRequest extends Request {
  validatedReviewId?: string;
}

export interface UpdateReviewValidatedRequest extends Request {
  validatedReviewUpdateBody?: UpdateReviewInput;
}

function readRating(value: unknown): number | null {
  const rating = readPositiveInteger(value);

  if (rating === null || rating > 5) {
    return null;
  }

  return rating;
}

function readOptionalComment(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (normalized === "" || normalized.length > 1000) {
    return null;
  }

  return normalized;
}

function readOptionalTitle(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized === "" || normalized.length > 200 ? null : normalized;
}

function readOptionalImages(value: unknown): string[] | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value) === false) {
    return null;
  }

  const images = value.map((image) =>
    typeof image === "string" ? image.trim() : "",
  );

  if (images.some((image) => image === "")) {
    return null;
  }

  return images;
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

export function validateCreateReviewBody(
  req: CreateReviewValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  if (typeof req.body !== "object" || req.body === null) {
    next(AppError.badRequest("Invalid review payload", "VALIDATION_ERROR"));
    return;
  }

  const body = req.body as Record<string, unknown>;
  const productId = readObjectId(body.productId);
  const rating = readRating(body.rating);
  const comment = readOptionalComment(body.comment);

  if (productId === null) {
    next(AppError.badRequest("productId is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (rating === null) {
    next(
      AppError.badRequest(
        "rating must be an integer from 1 to 5",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (comment === null) {
    next(
      AppError.badRequest(
        "comment must be a non-empty string up to 1000 characters",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  req.validatedReviewCreateBody = {
    productId,
    rating,
    ...(comment === undefined ? {} : { comment }),
  };
  next();
}

export function validateReviewIdParam(
  req: ReviewIdValidatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const reviewId = readObjectId(req.params.reviewId);

  if (reviewId === null) {
    next(AppError.badRequest("reviewId is invalid", "VALIDATION_ERROR"));
    return;
  }

  req.validatedReviewId = reviewId;
  next();
}

export function validateUpdateReviewBody(
  req: UpdateReviewValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  if (typeof req.body !== "object" || req.body === null) {
    next(AppError.badRequest("Invalid review payload", "VALIDATION_ERROR"));
    return;
  }

  const body = req.body as Record<string, unknown>;
  const rating = hasOwn(body, "rating") ? readRating(body.rating) : undefined;
  const title = hasOwn(body, "title") ? readOptionalTitle(body.title) : undefined;
  const comment = hasOwn(body, "comment")
    ? readOptionalComment(body.comment)
    : undefined;
  const images = hasOwn(body, "images")
    ? readOptionalImages(body.images)
    : undefined;

  if (rating === null) {
    next(
      AppError.badRequest(
        "rating must be an integer from 1 to 5",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (title === null) {
    next(
      AppError.badRequest(
        "title must be a non-empty string up to 200 characters",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (comment === null) {
    next(
      AppError.badRequest(
        "comment must be a non-empty string up to 1000 characters",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (images === null) {
    next(AppError.badRequest("images is invalid", "VALIDATION_ERROR"));
    return;
  }

  if (
    rating === undefined &&
    title === undefined &&
    comment === undefined &&
    images === undefined
  ) {
    next(
      AppError.badRequest(
        "Provide at least one review field to update",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  req.validatedReviewUpdateBody = {
    ...(rating === undefined ? {} : { rating }),
    ...(title === undefined ? {} : { title }),
    ...(comment === undefined ? {} : { comment }),
    ...(images === undefined ? {} : { images }),
  };
  next();
}

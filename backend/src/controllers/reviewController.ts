import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import type {
  CreateReviewValidatedRequest,
  ReviewIdValidatedRequest,
  UpdateReviewValidatedRequest,
} from "../middleware/reviewValidation.js";
import { AppError } from "../errors/AppError.js";
import {
  createVerifiedReview,
  deleteOwnedReview,
  toggleReviewLike,
  updateOwnedReview,
} from "../services/reviewService.js";
import type { ErrorResponse } from "../types/eyewear.js";
import type { ReviewResponse } from "../types/review.js";

type CreateReviewRequest =
  AuthenticatedRequest & CreateReviewValidatedRequest;
type ReviewIdRequest = AuthenticatedRequest & ReviewIdValidatedRequest;
type UpdateReviewRequest =
  AuthenticatedRequest & ReviewIdValidatedRequest & UpdateReviewValidatedRequest;

export async function createReview(
  req: CreateReviewRequest,
  res: Response<ReviewResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const validatedBody = req.validatedReviewCreateBody;

  if (userId === undefined || validatedBody === undefined) {
    throw AppError.badRequest("Invalid review request");
  }

  const responseData = await createVerifiedReview(userId, validatedBody);
  res.status(201).json(responseData);
}

export async function likeReview(
  req: ReviewIdRequest,
  res: Response<ReviewResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const reviewId = req.validatedReviewId;

  if (userId === undefined || reviewId === undefined) {
    throw AppError.badRequest("Invalid review like request");
  }

  res.status(200).json(await toggleReviewLike(userId, reviewId));
}

export async function updateReview(
  req: UpdateReviewRequest,
  res: Response<ReviewResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const reviewId = req.validatedReviewId;
  const input = req.validatedReviewUpdateBody;

  if (userId === undefined || reviewId === undefined || input === undefined) {
    throw AppError.badRequest("Invalid review update request");
  }

  res.status(200).json(await updateOwnedReview(userId, reviewId, input));
}

export async function deleteReview(
  req: ReviewIdRequest,
  res: Response<{ message: string } | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const reviewId = req.validatedReviewId;

  if (userId === undefined || reviewId === undefined) {
    throw AppError.badRequest("Invalid review delete request");
  }

  res.status(200).json(await deleteOwnedReview(userId, reviewId));
}

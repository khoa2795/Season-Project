import { Types } from "mongoose";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Order } from "../models/Order.js";
import { Review, type IReview } from "../models/Review.js";
import { Sunglasses } from "../models/Sunglasses.js";
import type { ProductModelName } from "../models/sharedProduct.js";
import type {
  CreateReviewInput,
  ReviewResponse,
  UpdateReviewInput,
} from "../types/review.js";

interface ReviewProduct {
  _id: Types.ObjectId;
  productModel: ProductModelName;
}

interface EligibleReviewOrder {
  _id: Types.ObjectId;
}

export class ReviewServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ReviewServiceError";
    this.statusCode = statusCode;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && error.code === 11000;
}

function toReviewResponse(review: IReview): ReviewResponse {
  if (review.orderId === undefined) {
    throw new ReviewServiceError("Verified review is missing its order", 500);
  }

  return {
    id: review._id.toString(),
    userId: review.userId.toString(),
    orderId: review.orderId.toString(),
    productId: review.productId.toString(),
    productModel: review.productModel,
    rating: review.rating,
    ...(review.title === undefined ? {} : { title: review.title }),
    ...(review.comment === undefined ? {} : { comment: review.comment }),
    images: review.images,
    likeCount: review.likedBy.length,
    isVerifiedPurchase: review.isVerifiedPurchase,
    isActive: review.isActive,
  };
}

async function requireActiveReview(reviewId: string): Promise<IReview> {
  const review = await Review.findById(reviewId);

  if (review === null || review.isActive !== true) {
    throw new ReviewServiceError("Review not found", 404);
  }

  return review;
}

async function findReviewProduct(productId: string): Promise<ReviewProduct | null> {
  const eyeglasses = await Eyeglasses.findById(productId)
    .select("_id")
    .lean<{ _id: Types.ObjectId } | null>();

  if (eyeglasses !== null) {
    return {
      _id: eyeglasses._id,
      productModel: "Eyeglasses",
    };
  }

  const sunglasses = await Sunglasses.findById(productId)
    .select("_id")
    .lean<{ _id: Types.ObjectId } | null>();

  if (sunglasses === null) {
    return null;
  }

  return {
    _id: sunglasses._id,
    productModel: "Sunglasses",
  };
}

async function findDeliveredOrderForProduct(
  userId: string,
  product: ReviewProduct,
): Promise<EligibleReviewOrder | null> {
  return Order.findOne({
    userId: new Types.ObjectId(userId),
    status: "delivered",
    items: {
      $elemMatch: {
        productId: product._id,
        productModel: product.productModel,
      },
    },
  })
    .select("_id")
    .sort({ deliveredAt: -1, createdAt: -1 })
    .lean<EligibleReviewOrder | null>();
}

export async function createVerifiedReview(
  userId: string,
  input: CreateReviewInput,
): Promise<ReviewResponse> {
  const product = await findReviewProduct(input.productId);

  if (product === null) {
    throw new ReviewServiceError("Product not found", 404);
  }

  const eligibleOrder = await findDeliveredOrderForProduct(userId, product);

  if (eligibleOrder === null) {
    throw new ReviewServiceError(
      "Only customers with a delivered order for this product can review it",
      403,
    );
  }

  const existingReview = await Review.exists({
    userId,
    productId: product._id,
    productModel: product.productModel,
  });

  if (existingReview !== null) {
    throw new ReviewServiceError(
      "You have already reviewed this product",
      409,
    );
  }

  try {
    const review = await Review.create({
      userId: new Types.ObjectId(userId),
      orderId: eligibleOrder._id,
      productId: product._id,
      productModel: product.productModel,
      rating: input.rating,
      ...(input.comment === undefined ? {} : { comment: input.comment }),
      isVerifiedPurchase: true,
    });

    return toReviewResponse(review);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ReviewServiceError(
        "You have already reviewed this product",
        409,
      );
    }

    throw error;
  }
}

export async function toggleReviewLike(
  userId: string,
  reviewId: string,
): Promise<ReviewResponse> {
  const review = await requireActiveReview(reviewId);
  const existingLikeIndex = review.likedBy.findIndex(
    (likedUserId) => likedUserId.toString() === userId,
  );

  if (existingLikeIndex === -1) {
    review.likedBy.push(new Types.ObjectId(userId));
  } else {
    review.likedBy.splice(existingLikeIndex, 1);
  }

  await review.save();
  return toReviewResponse(review);
}

export async function updateOwnedReview(
  userId: string,
  reviewId: string,
  input: UpdateReviewInput,
): Promise<ReviewResponse> {
  const review = await requireActiveReview(reviewId);

  if (review.userId.toString() !== userId) {
    throw new ReviewServiceError("Only the review owner can update it", 403);
  }

  if (input.rating !== undefined) {
    review.rating = input.rating;
  }

  if (input.title !== undefined) {
    review.title = input.title;
  }

  if (input.comment !== undefined) {
    review.comment = input.comment;
  }

  if (input.images !== undefined) {
    review.images = input.images;
  }

  await review.save();
  return toReviewResponse(review);
}

export async function deleteOwnedReview(
  userId: string,
  reviewId: string,
): Promise<{ message: string }> {
  const review = await requireActiveReview(reviewId);

  if (review.userId.toString() !== userId) {
    throw new ReviewServiceError("Only the review owner can delete it", 403);
  }

  await review.deleteOne();
  return {
    message: "Review deleted",
  };
}

export async function deleteReviewByAdmin(
  reviewId: string,
): Promise<{ message: string }> {
  const review = await Review.findById(reviewId);

  if (review === null) {
    throw new ReviewServiceError("Review not found", 404);
  }

  await review.deleteOne();
  return {
    message: "Review deleted",
  };
}

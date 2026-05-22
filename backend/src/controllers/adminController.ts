import type { Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { AdminTopProductsValidatedRequest } from "../middleware/adminValidation.js";
import type { UserIdValidatedRequest } from "../middleware/userValidation.js";
import type { ReviewIdValidatedRequest } from "../middleware/reviewValidation.js";
import type {
  OrderIdValidatedRequest,
  OrderListValidatedRequest,
} from "../middleware/orderValidation.js";
import {
  getAdminStatsOverview,
  getTopProductsForAdmin,
  getUserForAdmin,
  listUsersForAdmin,
  toggleUserStatusForAdmin,
} from "../services/adminService.js";
import {
  getOrderForAdmin,
  getOrdersForAdmin,
} from "../services/orderService.js";
import { deleteReviewByAdmin } from "../services/reviewService.js";
import type {
  AdminStatsOverviewResponse,
  AdminTopProductsResponse,
  AdminUserListResponse,
} from "../types/admin.js";
import type { ErrorResponse } from "../types/eyewear.js";
import type {
  CheckoutOrderResponse,
  OrderListResponse,
} from "../types/order.js";
import type { UserProfileResponse } from "../types/user.js";

export async function listAdminUsers(
  _req: UserIdValidatedRequest,
  res: Response<AdminUserListResponse | ErrorResponse>,
): Promise<void> {
  res.status(200).json(await listUsersForAdmin());
}

export async function getAdminUser(
  req: UserIdValidatedRequest,
  res: Response<UserProfileResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.validatedUserId;

  if (userId === undefined) {
    throw AppError.badRequest("Invalid admin user request");
  }

  res.status(200).json(await getUserForAdmin(userId));
}

export async function toggleAdminUserStatus(
  req: UserIdValidatedRequest,
  res: Response<UserProfileResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.validatedUserId;

  if (userId === undefined) {
    throw AppError.badRequest("Invalid admin user request");
  }

  res.status(200).json(await toggleUserStatusForAdmin(userId));
}

export async function listAdminOrders(
  req: OrderListValidatedRequest,
  res: Response<OrderListResponse | ErrorResponse>,
): Promise<void> {
  const query = req.validatedOrderListQuery;

  if (query === undefined) {
    throw AppError.badRequest("Invalid admin order list request");
  }

  res.status(200).json(await getOrdersForAdmin(query));
}

export async function getAdminOrder(
  req: OrderIdValidatedRequest,
  res: Response<CheckoutOrderResponse | ErrorResponse>,
): Promise<void> {
  const orderId = req.validatedOrderId;

  if (orderId === undefined) {
    throw AppError.badRequest("Invalid admin order request");
  }

  res.status(200).json(await getOrderForAdmin(orderId));
}

export async function getAdminTopProducts(
  req: AdminTopProductsValidatedRequest,
  res: Response<AdminTopProductsResponse | ErrorResponse>,
): Promise<void> {
  const query = req.validatedTopProductsQuery;

  if (query === undefined) {
    throw AppError.badRequest("Invalid top products request");
  }

  res.status(200).json(await getTopProductsForAdmin(query.limit));
}

export async function getAdminOverview(
  _req: AdminTopProductsValidatedRequest,
  res: Response<AdminStatsOverviewResponse | ErrorResponse>,
): Promise<void> {
  res.status(200).json(await getAdminStatsOverview());
}

export async function deleteAdminReview(
  req: ReviewIdValidatedRequest,
  res: Response<{ message: string } | ErrorResponse>,
): Promise<void> {
  const reviewId = req.validatedReviewId;

  if (reviewId === undefined) {
    throw AppError.badRequest("Invalid review delete request");
  }

  res.status(200).json(await deleteReviewByAdmin(reviewId));
}

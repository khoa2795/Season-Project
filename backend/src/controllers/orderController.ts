import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import type {
  CheckoutValidatedRequest,
  OrderIdValidatedRequest,
  OrderListValidatedRequest,
  OrderStatusValidatedRequest,
} from "../middleware/orderValidation.js";
import { AppError } from "../errors/AppError.js";
import {
  checkoutCart,
  cancelOrderForUser,
  getOrderForUser,
  getOrdersForUser,
  updateOrderStatusByAdmin,
} from "../services/orderService.js";
import type { ErrorResponse } from "../types/eyewear.js";
import type {
  CheckoutOrderResponse,
  OrderListResponse,
} from "../types/order.js";

type CheckoutRequest = AuthenticatedRequest & CheckoutValidatedRequest;
type AdminOrderStatusRequest =
  AuthenticatedRequest & OrderStatusValidatedRequest;
type UserOrderIdRequest = AuthenticatedRequest & OrderIdValidatedRequest;
type UserOrderListRequest = AuthenticatedRequest & OrderListValidatedRequest;

export async function checkout(
  req: CheckoutRequest,
  res: Response<CheckoutOrderResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const validatedBody = req.validatedBody;

  if (userId === undefined || validatedBody === undefined) {
    throw AppError.badRequest("Invalid checkout request");
  }

  const responseData = await checkoutCart(userId, validatedBody);
  res.status(201).json(responseData);
}

export async function updateOrderStatus(
  req: AdminOrderStatusRequest,
  res: Response<CheckoutOrderResponse | ErrorResponse>,
): Promise<void> {
  const validatedUpdate = req.validatedOrderStatusUpdate;

  if (validatedUpdate === undefined) {
    throw AppError.badRequest("Invalid order status request");
  }

  const responseData = await updateOrderStatusByAdmin(
    validatedUpdate.orderId,
    validatedUpdate.status,
  );
  res.status(200).json(responseData);
}

export async function listOrders(
  req: UserOrderListRequest,
  res: Response<OrderListResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const query = req.validatedOrderListQuery;

  if (userId === undefined || query === undefined) {
    throw AppError.badRequest("Invalid order list request");
  }

  res.status(200).json(await getOrdersForUser(userId, query));
}

export async function getOrder(
  req: UserOrderIdRequest,
  res: Response<CheckoutOrderResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const orderId = req.validatedOrderId;

  if (userId === undefined || orderId === undefined) {
    throw AppError.badRequest("Invalid order request");
  }

  res.status(200).json(await getOrderForUser(userId, orderId));
}

export async function cancelOrder(
  req: UserOrderIdRequest,
  res: Response<CheckoutOrderResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const orderId = req.validatedOrderId;

  if (userId === undefined || orderId === undefined) {
    throw AppError.badRequest("Invalid order cancellation request");
  }

  res.status(200).json(await cancelOrderForUser(userId, orderId));
}

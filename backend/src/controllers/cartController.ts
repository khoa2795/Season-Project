import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import type {
  AddCartItemValidatedRequest,
  CartSkuValidatedRequest,
  CartProductParamValidatedRequest,
  UpdateCartItemValidatedRequest,
} from "../middleware/cartValidation.js";
import { AppError } from "../errors/AppError.js";
import {
  addItemToCart,
  addSkuItemToCart,
  clearCartForUser,
  getCartForUser,
  removeItemFromCart,
  removeSkuItemFromCart,
  updateCartItemQuantity,
  updateSkuCartItemQuantity,
} from "../services/cartService.js";
import type { CartResponseData } from "../types/cart.js";
import type { ErrorResponse } from "../types/eyewear.js";

type AddCartItemRequest = AuthenticatedRequest & AddCartItemValidatedRequest;
type UpdateCartItemRequest = AuthenticatedRequest & UpdateCartItemValidatedRequest;
type RemoveCartItemRequest = AuthenticatedRequest & CartProductParamValidatedRequest;
type CartSkuRequest = AuthenticatedRequest & CartSkuValidatedRequest;

export async function addCartItem(
  req: AddCartItemRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const validatedBody = req.validatedBody;

  if (userId === undefined || validatedBody === undefined) {
    throw AppError.badRequest("Invalid add-to-cart request");
  }

  const responseData = await addItemToCart(userId, validatedBody);
  res.status(200).json(responseData);
}

export async function updateCartItem(
  req: UpdateCartItemRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const validatedBody = req.validatedBody;

  if (userId === undefined || validatedBody === undefined) {
    throw AppError.badRequest("Invalid update-cart-item request");
  }

  const responseData = await updateCartItemQuantity(userId, validatedBody);
  res.status(200).json(responseData);
}

export async function removeCartItem(
  req: RemoveCartItemRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const productId = req.validatedProductId;

  if (userId === undefined || productId === undefined) {
    throw AppError.badRequest("Invalid remove-cart-item request");
  }

  const responseData = await removeItemFromCart(userId, productId);
  res.status(200).json(responseData);
}

export async function getCart(
  req: AuthenticatedRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;

  if (userId === undefined) {
    throw AppError.badRequest("Invalid cart request");
  }

  res.status(200).json(await getCartForUser(userId));
}

export async function addCartSkuItem(
  req: CartSkuRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const input = req.validatedSkuBody;

  if (userId === undefined || input === undefined) {
    throw AppError.badRequest("Invalid add-to-cart request");
  }

  res.status(200).json(await addSkuItemToCart(userId, input));
}

export async function updateCartSkuItem(
  req: CartSkuRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const input = req.validatedSkuBody;

  if (userId === undefined || input === undefined) {
    throw AppError.badRequest("Invalid update-cart-item request");
  }

  res.status(200).json(await updateSkuCartItemQuantity(userId, input));
}

export async function removeCartSkuItem(
  req: CartSkuRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;
  const sku = req.validatedSku;

  if (userId === undefined || sku === undefined) {
    throw AppError.badRequest("Invalid remove-cart-item request");
  }

  res.status(200).json(await removeSkuItemFromCart(userId, sku));
}

export async function clearCart(
  req: AuthenticatedRequest,
  res: Response<CartResponseData | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;

  if (userId === undefined) {
    throw AppError.badRequest("Invalid cart request");
  }

  res.status(200).json(await clearCartForUser(userId));
}

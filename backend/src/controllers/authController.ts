import type { Response } from "express";
import type {
  ForgotPasswordValidatedRequest,
  LoginValidatedRequest,
  RefreshTokenValidatedRequest,
  RegisterValidatedRequest,
  ResetPasswordValidatedRequest,
} from "../middleware/authValidation.js";
import {
  getCurrentAuthUser,
  loginUser,
  logoutSession,
  requestPasswordReset,
  resetCustomerPassword,
  refreshAccessToken,
  registerUser,
} from "../services/authService.js";
import { AppError } from "../errors/AppError.js";
import type {
  LoginResponseData,
  LogoutResponseData,
  PasswordResetResponseData,
  RefreshTokenResponseData,
  RegisterResponseData,
} from "../types/auth.js";
import type { ErrorResponse } from "../types/eyewear.js";
import type { AuthUserResponse } from "../types/auth.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export async function register(
  req: RegisterValidatedRequest,
  res: Response<RegisterResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid register payload");
  }

  const responseData = await registerUser(validatedBody);
  res.status(201).json(responseData);
}

export async function login(
  req: LoginValidatedRequest,
  res: Response<LoginResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid login payload");
  }

  const responseData = await loginUser(validatedBody);
  res.status(200).json(responseData);
}

export async function refreshToken(
  req: RefreshTokenValidatedRequest,
  res: Response<RefreshTokenResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid refresh token payload");
  }

  const responseData = await refreshAccessToken(validatedBody);
  res.status(200).json(responseData);
}

export async function logout(
  req: RefreshTokenValidatedRequest,
  res: Response<LogoutResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid logout payload");
  }

  const responseData = await logoutSession(validatedBody);
  res.status(200).json(responseData);
}

export async function me(
  req: AuthenticatedRequest,
  res: Response<AuthUserResponse | ErrorResponse>,
): Promise<void> {
  const userId = req.authUserId;

  if (userId === undefined) {
    throw AppError.badRequest("Invalid current user request");
  }

  const responseData = await getCurrentAuthUser(userId);
  res.status(200).json(responseData);
}

export async function forgotPassword(
  req: ForgotPasswordValidatedRequest,
  res: Response<PasswordResetResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid forgot-password payload");
  }

  const responseData = await requestPasswordReset(validatedBody);
  res.status(200).json(responseData);
}

export async function resetPassword(
  req: ResetPasswordValidatedRequest,
  res: Response<PasswordResetResponseData | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid reset-password payload");
  }

  const responseData = await resetCustomerPassword(validatedBody);
  res.status(200).json(responseData);
}

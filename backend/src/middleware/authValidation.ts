import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResetPasswordInput,
} from "../types/auth.js";

interface JsonBodyRequest extends Request {
  body: unknown;
}

const BCRYPT_MAX_PASSWORD_BYTES = 72;

export interface RegisterValidatedRequest extends Request {
  validatedBody?: RegisterInput;
}

export interface LoginValidatedRequest extends Request {
  validatedBody?: LoginInput;
}

export interface RefreshTokenValidatedRequest extends Request {
  validatedBody?: RefreshTokenInput;
}

export interface ForgotPasswordValidatedRequest extends Request {
  validatedBody?: ForgotPasswordInput;
}

export interface ResetPasswordValidatedRequest extends Request {
  validatedBody?: ResetPasswordInput;
}

function readRequiredString(
  body: unknown,
  key: string,
): { value: string } | { error: string } {
  if (
    typeof body !== "object" ||
    body === null ||
    key in body === false
  ) {
    return { error: `${key} is required` };
  }

  const bodyRecord = body as Record<string, unknown>;
  const value = bodyRecord[key];

  if (typeof value !== "string" || value.trim() === "") {
    return { error: `${key} is required` };
  }

  return { value };
}

function readOptionalString(
  body: unknown,
  key: string,
): { value?: string } | { error: string } {
  if (
    typeof body !== "object" ||
    body === null ||
    key in body === false
  ) {
    return {};
  }

  const value = (body as Record<string, unknown>)[key];

  if (typeof value !== "string" || value.trim() === "") {
    return { error: `${key} is invalid` };
  }

  return { value: value.trim() };
}

function isPasswordWithinBcryptLimit(password: string): boolean {
  return Buffer.byteLength(password, "utf8") <= BCRYPT_MAX_PASSWORD_BYTES;
}

function rejectLongPassword(
  password: string,
  fieldName: "password" | "newPassword",
  next: NextFunction,
): boolean {
  if (isPasswordWithinBcryptLimit(password) === true) {
    return false;
  }

  next(
    AppError.badRequest(
      `${fieldName} must be at most ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8 bytes`,
      "VALIDATION_ERROR",
    ),
  );
  return true;
}

export function validateRegisterBody(
  req: RegisterValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  const email = readRequiredString(req.body, "email");
  const password = readRequiredString(req.body, "password");
  const name = readRequiredString(req.body, "name");
  const phone = readOptionalString(req.body, "phone");

  if ("error" in email) {
    next(AppError.badRequest(email.error, "VALIDATION_ERROR"));
    return;
  }

  if ("error" in password) {
    next(AppError.badRequest(password.error, "VALIDATION_ERROR"));
    return;
  }

  if ("error" in name) {
    next(AppError.badRequest(name.error, "VALIDATION_ERROR"));
    return;
  }

  if ("error" in phone) {
    next(AppError.badRequest(phone.error, "VALIDATION_ERROR"));
    return;
  }

  if (password.value.length < 8) {
    next(
      AppError.badRequest(
        "password must be at least 8 characters",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (rejectLongPassword(password.value, "password", next) === true) {
    return;
  }

  req.validatedBody = {
    email: email.value,
    password: password.value,
    name: name.value,
    ...(phone.value === undefined ? {} : { phone: phone.value }),
  };
  next();
}

export function validateLoginBody(
  req: LoginValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  const email = readRequiredString(req.body, "email");
  const password = readRequiredString(req.body, "password");

  if ("error" in email) {
    next(AppError.badRequest(email.error, "VALIDATION_ERROR"));
    return;
  }

  if ("error" in password) {
    next(AppError.badRequest(password.error, "VALIDATION_ERROR"));
    return;
  }

  if (rejectLongPassword(password.value, "password", next) === true) {
    return;
  }

  req.validatedBody = {
    email: email.value,
    password: password.value,
  };
  next();
}

export function validateForgotPasswordBody(
  req: ForgotPasswordValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  const email = readRequiredString(req.body, "email");

  if ("error" in email) {
    next(AppError.badRequest(email.error, "VALIDATION_ERROR"));
    return;
  }

  req.validatedBody = {
    email: email.value,
  };
  next();
}

export function validateResetPasswordBody(
  req: ResetPasswordValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = readRequiredString(req.body, "token");
  const newPassword = readRequiredString(req.body, "newPassword");

  if ("error" in token) {
    next(AppError.badRequest(token.error, "VALIDATION_ERROR"));
    return;
  }

  if ("error" in newPassword) {
    next(AppError.badRequest(newPassword.error, "VALIDATION_ERROR"));
    return;
  }

  if (newPassword.value.length < 8) {
    next(
      AppError.badRequest(
        "newPassword must be at least 8 characters",
        "VALIDATION_ERROR",
      ),
    );
    return;
  }

  if (rejectLongPassword(newPassword.value, "newPassword", next) === true) {
    return;
  }

  req.validatedBody = {
    token: token.value,
    newPassword: newPassword.value,
  };
  next();
}

export function validateRefreshTokenBody(
  req: RefreshTokenValidatedRequest & JsonBodyRequest,
  res: Response,
  next: NextFunction,
): void {
  const refreshToken = readRequiredString(req.body, "refreshToken");

  if ("error" in refreshToken) {
    next(AppError.badRequest(refreshToken.error, "VALIDATION_ERROR"));
    return;
  }

  req.validatedBody = {
    refreshToken: refreshToken.value,
  };
  next();
}

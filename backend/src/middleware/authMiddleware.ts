import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { User, type UserRole, type UserStatus } from "../models/User.js";
import {
  verifyAccessToken,
  type VerifiedAccessTokenPayload,
} from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  authUserId?: string;
  authUserRole?: UserRole;
}

function readBearerToken(authorization: string | undefined): string | null {
  if (authorization === undefined || authorization.trim() === "") {
    return null;
  }

  const [scheme, token, extraPart] = authorization.trim().split(/\s+/);

  if (
    scheme !== "Bearer" ||
    token === undefined ||
    token === "" ||
    extraPart !== undefined
  ) {
    return null;
  }

  return token;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const accessToken = readBearerToken(req.headers.authorization);

  if (accessToken === null) {
    next(AppError.unauthorized("Access token is required"));
    return;
  }

  let payload: VerifiedAccessTokenPayload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch {
    next(AppError.unauthorized("Access token is invalid or expired"));
    return;
  }

  const user = await User.findById(payload.sub)
    .select("status role isActive")
    .lean<{
      status: UserStatus;
      role: UserRole;
      isActive?: boolean;
    } | null>();

  if (
    user === null ||
    user.status !== "active" ||
    user.isActive === false
  ) {
    next(AppError.unauthorized("Access token is invalid"));
    return;
  }

  req.authUserId = payload.sub;
  req.authUserRole = user.role;
  next();
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.authUserRole !== "admin") {
    next(AppError.forbidden("Admin access is required"));
    return;
  }

  next();
}

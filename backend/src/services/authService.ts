import { createHash, randomBytes } from "node:crypto";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { User, type IUser } from "../models/User.js";
import type {
  AuthUserResponse,
  ForgotPasswordInput,
  LoginInput,
  LoginResponseData,
  LogoutResponseData,
  PasswordResetResponseData,
  RefreshTokenInput,
  RefreshTokenResponseData,
  RegisterInput,
  RegisterResponseData,
  ResetPasswordInput,
} from "../types/auth.js";
import {
  createAuthTokenPair,
  hashRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthServiceError";
    this.statusCode = statusCode;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000;

function hashPasswordResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function toAuthUserResponse(user: IUser): AuthUserResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    ...(user.phone === undefined ? {} : { phone: user.phone }),
    ...(user.avatar === undefined ? {} : { avatar: user.avatar }),
    role: user.role,
    status: user.status,
    isActive: user.isActive !== false,
  };
}

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResponseData> {
  const email = normalizeEmail(input.email);
  const existingUser = await User.exists({ email });

  if (existingUser !== null) {
    throw new AuthServiceError("Email is already registered", 409);
  }

  try {
    const user = await User.create({
      email,
      password: input.password,
      name: input.name.trim(),
      ...(input.phone === undefined ? {} : { phone: input.phone }),
    });

    return {
      user: toAuthUserResponse(user),
    };
  } catch (error) {
    if (isDuplicateKeyError(error) === true) {
      throw new AuthServiceError("Email is already registered", 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput): Promise<LoginResponseData> {
  const email = normalizeEmail(input.email);
  const user = await User.findOne({ email }).select("+password");

  if (user === null) {
    throw new AuthServiceError("Email or password is incorrect", 401);
  }

  const passwordMatches = await user.matchPassword(input.password);

  if (passwordMatches === false) {
    throw new AuthServiceError("Email or password is incorrect", 401);
  }

  if (user.status === "banned" || user.isActive === false) {
    throw new AuthServiceError("This account has been banned", 403);
  }

  const tokens = createAuthTokenPair(user);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: tokens.refreshTokenHash,
    expiresAt: tokens.refreshTokenExpiresAt,
  });

  return {
    user: toAuthUserResponse(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

function invalidRefreshTokenError(): AuthServiceError {
  return new AuthServiceError("Refresh token is invalid or expired", 401);
}

export async function refreshAccessToken(
  input: RefreshTokenInput,
): Promise<RefreshTokenResponseData> {
  let payload;

  try {
    payload = verifyRefreshToken(input.refreshToken);
  } catch {
    throw invalidRefreshTokenError();
  }

  const storedRefreshToken = await RefreshToken.findOneAndUpdate({
    userId: payload.sub,
    tokenHash: hashRefreshToken(input.refreshToken),
    expiresAt: { $gt: new Date() },
    revokedAt: { $exists: false },
  }, {
    $set: {
      revokedAt: new Date(),
    },
  }, {
    new: true,
  }).select("+tokenHash");

  if (storedRefreshToken === null) {
    await RefreshToken.deleteMany({
      userId: payload.sub,
      revokedAt: { $exists: false },
    });
    throw invalidRefreshTokenError();
  }

  const user = await User.findById(payload.sub);

  if (user === null || user.status === "banned" || user.isActive === false) {
    await RefreshToken.deleteMany({ userId: storedRefreshToken.userId });
    throw invalidRefreshTokenError();
  }

  const tokens = createAuthTokenPair(user);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: tokens.refreshTokenHash,
    expiresAt: tokens.refreshTokenExpiresAt,
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function logoutSession(
  input: RefreshTokenInput,
): Promise<LogoutResponseData> {
  await RefreshToken.deleteOne({
    tokenHash: hashRefreshToken(input.refreshToken),
  });

  return {
    message: "Logged out",
  };
}

export async function getCurrentAuthUser(
  userId: string,
): Promise<AuthUserResponse> {
  const user = await User.findById(userId);

  if (user === null || user.status !== "active" || user.isActive === false) {
    throw new AuthServiceError("User not found", 404);
  }

  return toAuthUserResponse(user);
}

function genericForgotPasswordResponse(): PasswordResetResponseData {
  return {
    message: "Email dat lai mat khau da duoc gui",
  };
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<PasswordResetResponseData> {
  const email = normalizeEmail(input.email);
  const user = await User.findOne({ email });

  if (
    user === null ||
    user.status !== "active" ||
    user.isActive === false ||
    user.role === "admin"
  ) {
    return genericForgotPasswordResponse();
  }

  const rawToken = randomBytes(32).toString("hex");

  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashPasswordResetToken(rawToken),
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  });

  return genericForgotPasswordResponse();
}

export async function resetCustomerPassword(
  input: ResetPasswordInput,
): Promise<PasswordResetResponseData> {
  const passwordResetToken = await PasswordResetToken.findOneAndDelete({
    tokenHash: hashPasswordResetToken(input.token),
    expiresAt: { $gt: new Date() },
  });

  if (passwordResetToken === null) {
    throw new AuthServiceError("Password reset token is invalid or expired", 401);
  }

  const user = await User.findById(passwordResetToken.userId);

  if (
    user === null ||
    user.role === "admin" ||
    user.status !== "active" ||
    user.isActive === false
  ) {
    throw new AuthServiceError("Password reset token is invalid or expired", 401);
  }

  user.password = input.newPassword;
  await user.save();
  await RefreshToken.deleteMany({ userId: user._id });

  return {
    message: "Password reset successfully",
  };
}

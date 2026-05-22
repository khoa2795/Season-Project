import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refreshToken,
  register,
  resetPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  validateForgotPasswordBody,
  validateLoginBody,
  validateRefreshTokenBody,
  validateRegisterBody,
  validateResetPasswordBody,
} from "../middleware/authValidation.js";
import { createIpRateLimiter } from "../middleware/rateLimit.js";

const router = Router();
const authRateLimit = createIpRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: "Too many authentication attempts. Try again later.",
});
const passwordResetRateLimit = createIpRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: "Too many password reset attempts. Try again later.",
});

router.post("/register", authRateLimit, validateRegisterBody, register);
router.post("/login", authRateLimit, validateLoginBody, login);
router.get("/me", requireAuth, me);
router.post("/refresh-token", authRateLimit, validateRefreshTokenBody, refreshToken);
router.post("/logout", validateRefreshTokenBody, logout);
router.post(
  "/forgot-password",
  passwordResetRateLimit,
  validateForgotPasswordBody,
  forgotPassword,
);
router.post(
  "/reset-password",
  passwordResetRateLimit,
  validateResetPasswordBody,
  resetPassword,
);

export default router;

import { Router } from "express";
import {
  createReview,
  deleteReview,
  likeReview,
  updateReview,
} from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  validateCreateReviewBody,
  validateReviewIdParam,
  validateUpdateReviewBody,
} from "../middleware/reviewValidation.js";

const router = Router();

router.post("/", requireAuth, validateCreateReviewBody, createReview);
router.post("/:reviewId/like", requireAuth, validateReviewIdParam, likeReview);
router.put(
  "/:reviewId",
  requireAuth,
  validateReviewIdParam,
  validateUpdateReviewBody,
  updateReview,
);
router.delete("/:reviewId", requireAuth, validateReviewIdParam, deleteReview);

export default router;

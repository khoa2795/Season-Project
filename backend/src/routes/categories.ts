import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategorySlug,
  listCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import {
  validateCategoryIdParam,
  validateCreateCategoryBody,
  validateUpdateCategoryBody,
} from "../middleware/categoryValidation.js";

const router = Router();

router.get("/", listCategories);
router.get("/slug/:slug", getCategorySlug);
router.get("/:categoryId", validateCategoryIdParam, getCategory);
router.post("/", requireAuth, requireAdmin, validateCreateCategoryBody, createCategory);
router.put(
  "/:categoryId",
  requireAuth,
  requireAdmin,
  validateCategoryIdParam,
  validateUpdateCategoryBody,
  updateCategory,
);
router.delete(
  "/:categoryId",
  requireAuth,
  requireAdmin,
  validateCategoryIdParam,
  deleteCategory,
);

export default router;

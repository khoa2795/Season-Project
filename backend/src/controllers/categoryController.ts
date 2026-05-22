import type { Response } from "express";
import type {
  CategoryCreateValidatedRequest,
  CategoryIdValidatedRequest,
  CategoryUpdateValidatedRequest,
} from "../middleware/categoryValidation.js";
import { AppError } from "../errors/AppError.js";
import {
  createCategory as createCategoryRecord,
  deleteCategory as deleteCategoryRecord,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory as updateCategoryRecord,
} from "../services/categoryService.js";
import type {
  CategoryListResponse,
  CategoryResponse,
  DeleteCategoryResponse,
} from "../types/category.js";
import type { ErrorResponse } from "../types/eyewear.js";

export async function listCategories(
  _req: CategoryIdValidatedRequest,
  res: Response<CategoryListResponse | ErrorResponse>,
): Promise<void> {
  const responseData = await getCategories();
  res.status(200).json(responseData);
}

export async function getCategory(
  req: CategoryIdValidatedRequest,
  res: Response<CategoryResponse | ErrorResponse>,
): Promise<void> {
  const categoryId = req.validatedCategoryId;

  if (categoryId === undefined) {
    throw AppError.badRequest("Invalid category request");
  }

  const responseData = await getCategoryById(categoryId);
  res.status(200).json(responseData);
}

export async function getCategorySlug(
  req: CategoryIdValidatedRequest,
  res: Response<CategoryResponse | ErrorResponse>,
): Promise<void> {
  const slug = req.params.slug;

  if (typeof slug !== "string" || slug.trim() === "") {
    throw AppError.badRequest("Invalid category slug");
  }

  const responseData = await getCategoryBySlug(slug.trim().toLowerCase());
  res.status(200).json(responseData);
}

export async function createCategory(
  req: CategoryCreateValidatedRequest,
  res: Response<CategoryResponse | ErrorResponse>,
): Promise<void> {
  const validatedBody = req.validatedCategoryCreateBody;

  if (validatedBody === undefined) {
    throw AppError.badRequest("Invalid category request");
  }

  const responseData = await createCategoryRecord(validatedBody);
  res.status(201).json(responseData);
}

export async function updateCategory(
  req: CategoryIdValidatedRequest & CategoryUpdateValidatedRequest,
  res: Response<CategoryResponse | ErrorResponse>,
): Promise<void> {
  const categoryId = req.validatedCategoryId;
  const validatedBody = req.validatedCategoryUpdateBody;

  if (categoryId === undefined || validatedBody === undefined) {
    throw AppError.badRequest("Invalid category request");
  }

  const responseData = await updateCategoryRecord(categoryId, validatedBody);
  res.status(200).json(responseData);
}

export async function deleteCategory(
  req: CategoryIdValidatedRequest,
  res: Response<DeleteCategoryResponse | ErrorResponse>,
): Promise<void> {
  const categoryId = req.validatedCategoryId;

  if (categoryId === undefined) {
    throw AppError.badRequest("Invalid category request");
  }

  const responseData = await deleteCategoryRecord(categoryId);
  res.status(200).json(responseData);
}

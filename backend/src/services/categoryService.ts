import { Types } from "mongoose";
import { Category, type ICategory } from "../models/Category.js";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Sunglasses } from "../models/Sunglasses.js";
import type {
  CategoryCreateInput,
  CategoryListResponse,
  CategoryResponse,
  CategoryUpdateInput,
  DeleteCategoryResponse,
} from "../types/category.js";

export class CategoryServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CategoryServiceError";
    this.statusCode = statusCode;
  }
}

function toCategoryResponse(category: ICategory): CategoryResponse {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    ...(category.description === undefined
      ? {}
      : { description: category.description }),
    ...(category.parentCategoryId === undefined
      ? {}
      : { parentCategoryId: category.parentCategoryId.toString() }),
    order: category.order ?? 0,
    isActive: category.isActive,
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && error.code === 11000;
}

async function requireAvailableSlug(
  slug: string,
  excludedCategoryId?: Types.ObjectId,
): Promise<void> {
  const slugFilter =
    excludedCategoryId === undefined
      ? { slug }
      : { slug, _id: { $ne: excludedCategoryId } };
  const category = await Category.exists(slugFilter);

  if (category !== null) {
    throw new CategoryServiceError("Category slug already exists", 409);
  }
}

async function requireParentCategory(
  parentCategoryId: string,
  currentCategoryId?: Types.ObjectId,
): Promise<Types.ObjectId> {
  const parentObjectId = new Types.ObjectId(parentCategoryId);

  if (
    currentCategoryId !== undefined &&
    parentObjectId.equals(currentCategoryId)
  ) {
    throw new CategoryServiceError("Category cannot be its own parent", 400);
  }

  const parentCategory = await Category.exists({ _id: parentObjectId });

  if (parentCategory === null) {
    throw new CategoryServiceError("Parent category not found", 400);
  }

  return parentObjectId;
}

export async function getCategories(): Promise<CategoryListResponse> {
  const categories = await Category.find().sort({ name: 1 });

  return {
    records: categories.map(toCategoryResponse),
  };
}

export async function getCategoryById(
  categoryId: string,
): Promise<CategoryResponse> {
  const category = await Category.findById(categoryId);

  if (category === null) {
    throw new CategoryServiceError("Category not found", 404);
  }

  return toCategoryResponse(category);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryResponse> {
  const category = await Category.findOne({ slug });

  if (category === null) {
    throw new CategoryServiceError("Category not found", 404);
  }

  return toCategoryResponse(category);
}

export async function createCategory(
  input: CategoryCreateInput,
): Promise<CategoryResponse> {
  await requireAvailableSlug(input.slug);

  const parentCategoryId =
    input.parentCategoryId === undefined
      ? undefined
      : await requireParentCategory(input.parentCategoryId);

  try {
    const category = await Category.create({
      name: input.name,
      slug: input.slug,
      ...(input.description === undefined
        ? {}
        : { description: input.description }),
      ...(parentCategoryId === undefined ? {} : { parentCategoryId }),
      ...(input.order === undefined ? {} : { order: input.order }),
      ...(input.isActive === undefined ? {} : { isActive: input.isActive }),
    });

    return toCategoryResponse(category);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CategoryServiceError("Category slug already exists", 409);
    }

    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  input: CategoryUpdateInput,
): Promise<CategoryResponse> {
  const category = await Category.findById(categoryId);

  if (category === null) {
    throw new CategoryServiceError("Category not found", 404);
  }

  if (input.name !== undefined) {
    category.name = input.name;
  }

  if (input.slug !== undefined && input.slug !== category.slug) {
    await requireAvailableSlug(input.slug, category._id as Types.ObjectId);
    category.slug = input.slug;
  }

  if (input.description !== undefined) {
    if (input.description === null) {
      category.set("description", undefined);
    } else {
      category.description = input.description;
    }
  }

  if (input.parentCategoryId !== undefined) {
    if (input.parentCategoryId === null) {
      category.set("parentCategoryId", undefined);
    } else {
      category.parentCategoryId = await requireParentCategory(
        input.parentCategoryId,
        category._id as Types.ObjectId,
      );
    }
  }

  if (input.isActive !== undefined) {
    category.isActive = input.isActive;
  }

  if (input.order !== undefined) {
    category.order = input.order;
  }

  try {
    await category.save();
    return toCategoryResponse(category);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new CategoryServiceError("Category slug already exists", 409);
    }

    throw error;
  }
}

export async function deleteCategory(
  categoryId: string,
): Promise<DeleteCategoryResponse> {
  const category = await Category.exists({ _id: categoryId });

  if (category === null) {
    throw new CategoryServiceError("Category not found", 404);
  }

  const [eyeglassesProduct, sunglassesProduct] = await Promise.all([
    Eyeglasses.exists({ categoryId }),
    Sunglasses.exists({ categoryId }),
  ]);

  if (eyeglassesProduct !== null || sunglassesProduct !== null) {
    throw new CategoryServiceError(
      "Category has assigned products. Move those products to another category before deleting it.",
      409,
    );
  }

  const childCategory = await Category.exists({ parentCategoryId: categoryId });

  if (childCategory !== null) {
    throw new CategoryServiceError(
      "Category has child categories. Move those categories before deleting it.",
      409,
    );
  }

  const deletion = await Category.deleteOne({ _id: categoryId });

  if (deletion.deletedCount !== 1) {
    throw new CategoryServiceError("Failed to delete category", 500);
  }

  return {
    message: "Category deleted",
  };
}

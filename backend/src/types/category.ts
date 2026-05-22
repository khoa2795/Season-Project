export interface CategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  order?: number;
  isActive?: boolean;
}

export interface CategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string | null;
  parentCategoryId?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  order: number;
  isActive: boolean;
}

export interface CategoryListResponse {
  records: CategoryResponse[];
}

export interface DeleteCategoryResponse {
  message: string;
}

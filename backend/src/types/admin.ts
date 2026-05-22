import type { UserProfileResponse } from "./user.js";

export interface AdminUserListResponse {
  records: UserProfileResponse[];
}

export interface AdminStatsOverviewResponse {
  totalUsers: number;
  totalOrders: number;
  revenueThisMonth: number;
  lowStockCount: number;
}

export interface AdminTopProductsQuery {
  limit: number;
}

export interface AdminTopProductResponse {
  _id: string;
  name: string;
  image: string | null;
  slug: string | null;
  isActive: boolean | null;
  rating: {
    avg: number;
    count: number;
  } | null;
  totalSold: number;
  totalRevenue: number;
}

export interface AdminTopProductsResponse {
  records: AdminTopProductResponse[];
}

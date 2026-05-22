import { Types } from "mongoose";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Order } from "../models/Order.js";
import { Sunglasses } from "../models/Sunglasses.js";
import { User, type IUser } from "../models/User.js";
import type {
  AdminStatsOverviewResponse,
  AdminTopProductResponse,
  AdminTopProductsResponse,
  AdminUserListResponse,
} from "../types/admin.js";
import type { ProductModelName, IProductRating, IVariant } from "../models/sharedProduct.js";
import type { UserProfileResponse } from "../types/user.js";
import { countLowStockInventory } from "./inventoryService.js";

interface TopProductAggregate {
  _id: {
    productId: Types.ObjectId;
    productModel: ProductModelName;
  };
  name: string;
  totalSold: number;
  totalRevenue: number;
}

interface TopProductDetails {
  slug: string;
  isActive: boolean;
  rating: IProductRating;
  variants: IVariant[];
}

export class AdminServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AdminServiceError";
    this.statusCode = statusCode;
  }
}

function toAdminUserResponse(user: IUser): UserProfileResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    ...(user.phone === undefined ? {} : { phone: user.phone }),
    ...(user.avatar === undefined ? {} : { avatar: user.avatar }),
    role: user.role,
    status: user.status,
    isActive: user.isActive !== false,
    addresses: user.addresses.map((address) => ({
      _id: address._id?.toString() ?? "",
      ...(address.label === undefined ? {} : { label: address.label }),
      address: address.address,
      isDefault: address.isDefault,
    })),
  };
}

export async function listUsersForAdmin(): Promise<AdminUserListResponse> {
  const users = await User.find().sort({ createdAt: -1 });

  return {
    records: users.map(toAdminUserResponse),
  };
}

export async function getUserForAdmin(
  userId: string,
): Promise<UserProfileResponse> {
  const user = await User.findById(userId);

  if (user === null) {
    throw new AdminServiceError("User not found", 404);
  }

  return toAdminUserResponse(user);
}

export async function toggleUserStatusForAdmin(
  userId: string,
): Promise<UserProfileResponse> {
  const user = await User.findById(userId);

  if (user === null) {
    throw new AdminServiceError("User not found", 404);
  }

  const nextIsActive = user.isActive === false;
  user.isActive = nextIsActive;
  user.status = nextIsActive ? "active" : "banned";
  await user.save();

  return toAdminUserResponse(user);
}

function firstVariantImage(variants: IVariant[]): string | null {
  const defaultVariant =
    variants.find((variant) => variant.isDefault === true) ?? variants[0];

  return defaultVariant?.images[0] ?? null;
}

async function findTopProductDetails(
  productId: Types.ObjectId,
  productModel: ProductModelName,
): Promise<TopProductDetails | null> {
  const fields = "slug isActive rating variants";

  if (productModel === "Eyeglasses") {
    return Eyeglasses.findById(productId)
      .select(fields)
      .lean<TopProductDetails | null>();
  }

  return Sunglasses.findById(productId)
    .select(fields)
    .lean<TopProductDetails | null>();
}

async function toTopProductResponse(
  product: TopProductAggregate,
): Promise<AdminTopProductResponse> {
  const details = await findTopProductDetails(
    product._id.productId,
    product._id.productModel,
  );

  return {
    _id: product._id.productId.toString(),
    name: product.name,
    image: details === null ? null : firstVariantImage(details.variants),
    slug: details?.slug ?? null,
    isActive: details?.isActive ?? null,
    rating: details?.rating ?? null,
    totalSold: product.totalSold,
    totalRevenue: product.totalRevenue,
  };
}

export async function getTopProductsForAdmin(
  limit: number,
): Promise<AdminTopProductsResponse> {
  const products = await Order.aggregate<TopProductAggregate>([
    { $match: { status: "delivered" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          productId: "$items.productId",
          productModel: "$items.productModel",
        },
        name: { $first: "$items.productName" },
        totalSold: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.lineTotal" },
      },
    },
    { $sort: { totalSold: -1, totalRevenue: -1 } },
    { $limit: limit },
  ]);

  return {
    records: await Promise.all(products.map(toTopProductResponse)),
  };
}

function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getAdminStatsOverview(): Promise<AdminStatsOverviewResponse> {
  const [totalUsers, totalOrders, revenueRows, lowStockCount] =
    await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate<{ _id: null; revenue: number }>([
        {
          $match: {
            status: "delivered",
            createdAt: { $gte: startOfCurrentMonth() },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      countLowStockInventory(),
    ]);

  return {
    totalUsers,
    totalOrders,
    revenueThisMonth: revenueRows[0]?.revenue ?? 0,
    lowStockCount,
  };
}

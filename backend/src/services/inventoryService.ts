import { Types } from "mongoose";
import { Eyeglasses } from "../models/Eyeglasses.js";
import { Sunglasses } from "../models/Sunglasses.js";
import type { IVariant } from "../models/sharedProduct.js";
import type {
  InventoryCheckQuery,
  InventoryCheckResponse,
  InventoryListQuery,
  InventoryListResponse,
  InventoryRecord,
  InventoryStockUpdateInput,
} from "../types/inventory.js";

interface InventoryProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  variants: IVariant[];
  updatedAt?: Date;
}

export class InventoryServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "InventoryServiceError";
    this.statusCode = statusCode;
  }
}

function toInventoryRecord(
  product: InventoryProduct,
  variant: IVariant,
): InventoryRecord {
  return {
    _id: `${product._id.toString()}:${variant.sku}`,
    sku: variant.sku,
    productId: {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
    },
    stock: variant.stock,
    reserved: 0,
    available: variant.stock,
    warehouse: "main",
    ...(product.updatedAt === undefined
      ? {}
      : { lastRestocked: product.updatedAt }),
  };
}

async function loadInventoryProducts(
  productId?: string,
): Promise<InventoryProduct[]> {
  const filter =
    productId === undefined ? {} : { _id: new Types.ObjectId(productId) };
  const fields = "name slug variants updatedAt";
  const [eyeglasses, sunglasses] = await Promise.all([
    Eyeglasses.find(filter).select(fields).lean<InventoryProduct[]>(),
    Sunglasses.find(filter).select(fields).lean<InventoryProduct[]>(),
  ]);

  return [...eyeglasses, ...sunglasses];
}

async function getInventoryRecords(productId?: string): Promise<InventoryRecord[]> {
  const products = await loadInventoryProducts(productId);

  return products.flatMap((product) =>
    product.variants.map((variant) => toInventoryRecord(product, variant)),
  );
}

async function getProductInventoryBySku(
  sku: string,
): Promise<InventoryRecord | null> {
  const fields = "name slug variants updatedAt";
  const [eyeglasses, sunglasses] = await Promise.all([
    Eyeglasses.findOne({ "variants.sku": sku })
      .select(fields)
      .lean<InventoryProduct | null>(),
    Sunglasses.findOne({ "variants.sku": sku })
      .select(fields)
      .lean<InventoryProduct | null>(),
  ]);
  const product = eyeglasses ?? sunglasses;

  if (product === null) {
    return null;
  }

  const variant = product.variants.find((item) => item.sku === sku);
  return variant === undefined ? null : toInventoryRecord(product, variant);
}

function sortInventoryRecords(records: InventoryRecord[]): InventoryRecord[] {
  return records.sort((left, right) => left.sku.localeCompare(right.sku));
}

export async function listInventory(
  query: InventoryListQuery,
): Promise<InventoryListResponse> {
  const records = sortInventoryRecords(await getInventoryRecords(query.productId));
  const filteredRecords =
    query.lowStock === true
      ? records.filter((record) => record.available < 10)
      : records;
  const firstIndex = (query.page - 1) * query.limit;
  const totalInventories = filteredRecords.length;

  return {
    records: filteredRecords.slice(firstIndex, firstIndex + query.limit),
    totalInventories,
    currentPage: query.page,
    totalPages: Math.ceil(totalInventories / query.limit),
    limit: query.limit,
  };
}

export async function getInventoryBySku(sku: string): Promise<InventoryRecord> {
  const record = await getProductInventoryBySku(sku);

  if (record === null) {
    throw new InventoryServiceError("Inventory SKU not found", 404);
  }

  return record;
}

export async function checkInventory(
  query: InventoryCheckQuery,
): Promise<InventoryCheckResponse> {
  const inventory = await getInventoryBySku(query.sku);

  return {
    available: inventory.available >= query.quantity,
    currentStock: inventory.stock,
    reserved: inventory.reserved,
    availableStock: inventory.available,
    requestedQuantity: query.quantity,
    sku: inventory.sku,
  };
}

export async function updateInventoryStock(
  input: InventoryStockUpdateInput,
): Promise<InventoryRecord> {
  const eyeglasses = await Eyeglasses.findOne({ "variants.sku": input.sku });

  if (eyeglasses !== null) {
    const variant = eyeglasses.variants.find((item) => item.sku === input.sku);

    if (variant !== undefined) {
      variant.stock = input.stock;
      eyeglasses.markModified("variants");
      await eyeglasses.save();
      return getInventoryBySku(input.sku);
    }
  }

  const sunglasses = await Sunglasses.findOne({ "variants.sku": input.sku });

  if (sunglasses === null) {
    throw new InventoryServiceError("Inventory SKU not found", 404);
  }

  const variant = sunglasses.variants.find((item) => item.sku === input.sku);

  if (variant === undefined) {
    throw new InventoryServiceError("Inventory SKU not found", 404);
  }

  variant.stock = input.stock;
  sunglasses.markModified("variants");
  await sunglasses.save();
  return getInventoryBySku(input.sku);
}

export async function countLowStockInventory(): Promise<number> {
  const records = await getInventoryRecords();
  return records.filter((record) => record.available < 10).length;
}

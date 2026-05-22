import type { Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { ErrorResponse } from "../types/eyewear.js";
import type {
  InventoryCheckResponse,
  InventoryListResponse,
  InventoryRecord,
} from "../types/inventory.js";
import type { InventoryValidatedRequest } from "../middleware/inventoryValidation.js";
import {
  checkInventory,
  getInventoryBySku,
  listInventory,
  updateInventoryStock,
} from "../services/inventoryService.js";

export async function checkSkuInventory(
  req: InventoryValidatedRequest,
  res: Response<InventoryCheckResponse | ErrorResponse>,
): Promise<void> {
  const query = req.validatedInventoryCheckQuery;

  if (query === undefined) {
    throw AppError.badRequest("Invalid inventory check request");
  }

  res.status(200).json(await checkInventory(query));
}

export async function listAdminInventory(
  req: InventoryValidatedRequest,
  res: Response<InventoryListResponse | ErrorResponse>,
): Promise<void> {
  const query = req.validatedInventoryListQuery;

  if (query === undefined) {
    throw AppError.badRequest("Invalid inventory list request");
  }

  res.status(200).json(await listInventory(query));
}

export async function getAdminInventory(
  req: InventoryValidatedRequest,
  res: Response<InventoryRecord | ErrorResponse>,
): Promise<void> {
  const sku = req.validatedInventorySku;

  if (sku === undefined) {
    throw AppError.badRequest("Invalid inventory request");
  }

  res.status(200).json(await getInventoryBySku(sku));
}

export async function updateAdminInventory(
  req: InventoryValidatedRequest,
  res: Response<InventoryRecord | ErrorResponse>,
): Promise<void> {
  const input = req.validatedInventoryStockUpdate;

  if (input === undefined) {
    throw AppError.badRequest("Invalid inventory update request");
  }

  res.status(200).json(await updateInventoryStock(input));
}

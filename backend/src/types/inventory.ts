export interface InventoryListQuery {
  productId?: string;
  lowStock?: boolean;
  page: number;
  limit: number;
}

export interface InventoryCheckQuery {
  sku: string;
  quantity: number;
}

export interface InventoryProductReference {
  _id: string;
  name: string;
  slug: string;
}

export interface InventoryRecord {
  _id: string;
  sku: string;
  productId: InventoryProductReference;
  stock: number;
  reserved: number;
  available: number;
  warehouse: string;
  lastRestocked?: Date;
}

export interface InventoryListResponse {
  records: InventoryRecord[];
  totalInventories: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface InventoryCheckResponse {
  available: boolean;
  currentStock: number;
  reserved: number;
  availableStock: number;
  requestedQuantity: number;
  sku: string;
}

export interface InventoryStockUpdateInput {
  sku: string;
  stock: number;
}

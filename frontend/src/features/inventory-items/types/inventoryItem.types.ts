import type { PageResponse } from "@/features/maintenance";

export interface InventoryStock {
  stockId: number;
  stock: number;
  stockMin: number;
  warehouseId: number;
  warehouseName: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  stocks: InventoryStock[];
}

export type InventoryItemPage = PageResponse<InventoryItem>;

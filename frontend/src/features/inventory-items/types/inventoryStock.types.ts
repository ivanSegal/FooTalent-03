import type { PageResponse } from "@/features/maintenance";

export interface InventoryStockRow {
  id: number;
  stock: number;
  stockMin: number;
  warehouseId: number;
  warehouseName: string;
  itemWarehouseId: number;
  itemWarehouseName: string;
}

export type InventoryStockPage = PageResponse<InventoryStockRow>;

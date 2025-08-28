import type { PageResponse } from "@/features/maintenance";

export interface WarehouseItem {
  id: number;
  name: string;
  description: string;
  stock: number;
  stockMin: number;
  warehouseName: string;
}

export type WarehouseItemPage = PageResponse<WarehouseItem>;

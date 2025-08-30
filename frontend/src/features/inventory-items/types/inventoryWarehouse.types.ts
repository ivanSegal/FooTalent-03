import type { PageResponse } from "@/features/maintenance";

export interface InventoryWarehouse {
  id: number;
  name: string;
  location: string;
}

export type InventoryWarehousePage = PageResponse<InventoryWarehouse>;

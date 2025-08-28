import type { PageResponse } from "@/features/maintenance";

export interface Warehouse {
  id: number;
  name: string;
  location: string;
}

export type WarehousePage = PageResponse<Warehouse>;

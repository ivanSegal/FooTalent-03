import type { PageResponse } from "@/features/maintenance";

export type MovementType = "ENTRADA" | "SALIDA";

export interface InventoryMovementDetail {
  itemWarehouseId: number;
  itemWarehouseName: string;
  quantity: number;
}

export interface InventoryMovement {
  id: number;
  warehouseId: number;
  warehouseName: string;
  movementType: MovementType;
  date: string; // YYYY-MM-DD
  reason?: string | null;
  responsibleId?: string | null;
  responsibleName?: string | null;
  movementDetails: InventoryMovementDetail[];
}

export type InventoryMovementPage = PageResponse<InventoryMovement>;

export interface InventoryMovementRequest {
  warehouseId: number;
  movementType: MovementType;
  date: string; // YYYY-MM-DD
  reason?: string | null;
  // Si el backend toma el responsable del token, podemos omitirlo
  responsibleId?: string | null;
  movementDetails: Array<{
    itemWarehouseId: number;
    quantity: number;
  }>;
}

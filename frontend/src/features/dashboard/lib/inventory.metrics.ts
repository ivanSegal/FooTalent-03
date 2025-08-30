import type { InventoryStockPage } from "@/features/inventory-items/types/inventoryStock.types";
import type {
  InventoryMovementPage,
  InventoryMovement,
} from "@/features/inventory-items/types/inventoryMovement.types";

export interface InventoryMetrics {
  lowStockCount: number;
  outOfStockCount: number;
  // NUEVO: listado de ítems en stock bajo (>0 y <= stockMin)
  lowStockItems: Array<{
    itemWarehouseId: number;
    itemWarehouseName: string;
    warehouseId: number;
    warehouseName: string;
    stock: number;
    stockMin: number;
  }>;
  // NUEVO: listado de ítems sin stock (== 0)
  outOfStockItems: Array<{
    itemWarehouseId: number;
    itemWarehouseName: string;
    warehouseId: number;
    warehouseName: string;
    stock: number; // 0
    stockMin: number;
  }>;
  mostOutboundItems: Array<{
    itemWarehouseId: number;
    itemWarehouseName: string;
    totalOut: number;
  }>;
  recentMovements: InventoryMovement[];
}

export function buildInventoryMetrics(
  stocks: InventoryStockPage | null | undefined,
  movements: InventoryMovementPage | null | undefined,
): InventoryMetrics {
  // Low/out of stock counts
  let lowStockCount = 0;
  let outOfStockCount = 0;
  const lowStockItems: InventoryMetrics["lowStockItems"] = [];
  const outOfStockItems: InventoryMetrics["outOfStockItems"] = [];
  for (const row of stocks?.content ?? []) {
    const stock = Number(row.stock ?? 0);
    const stockMin = Number(row.stockMin ?? 0);
    if (stock === 0) outOfStockCount++;
    if (stock > 0 && stock <= stockMin) lowStockCount++;
    // Sin stock (detalle)
    if (stock === 0) {
      outOfStockItems.push({
        itemWarehouseId: Number(row.itemWarehouseId),
        itemWarehouseName: String(row.itemWarehouseName ?? ""),
        warehouseId: Number(row.warehouseId),
        warehouseName: String(row.warehouseName ?? ""),
        stock,
        stockMin,
      });
    }
    // Stock bajo pero no cero (detalle)
    if (stock > 0 && stock <= stockMin) {
      lowStockItems.push({
        itemWarehouseId: Number(row.itemWarehouseId),
        itemWarehouseName: String(row.itemWarehouseName ?? ""),
        warehouseId: Number(row.warehouseId),
        warehouseName: String(row.warehouseName ?? ""),
        stock,
        stockMin,
      });
    }
  }

  // Orden: más críticos primero
  lowStockItems.sort(
    (a, b) => a.stock / Math.max(1, a.stockMin) - b.stock / Math.max(1, b.stockMin),
  );
  outOfStockItems.sort((a, b) => b.stockMin - a.stockMin);

  // Most outbound items (movementType === "SALIDA")
  const outboundMap = new Map<
    number,
    { itemWarehouseId: number; itemWarehouseName: string; totalOut: number }
  >();
  for (const mv of movements?.content ?? []) {
    if (String(mv.movementType).toUpperCase() !== "SALIDA") continue;
    for (const d of mv.movementDetails ?? []) {
      const id = Number(d.itemWarehouseId);
      const name = String(d.itemWarehouseName ?? "");
      const curr = outboundMap.get(id) ?? {
        itemWarehouseId: id,
        itemWarehouseName: name,
        totalOut: 0,
      };
      curr.totalOut += Number(d.quantity ?? 0);
      curr.itemWarehouseName = curr.itemWarehouseName || name;
      outboundMap.set(id, curr);
    }
  }
  const mostOutboundItems = Array.from(outboundMap.values()).sort(
    (a, b) => b.totalOut - a.totalOut,
  );

  // Recent movements (already sorted desc if provided; otherwise sort by date desc)
  const recentMovements = [...(movements?.content ?? [])].sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );

  return {
    lowStockCount,
    outOfStockCount,
    lowStockItems,
    outOfStockItems,
    mostOutboundItems,
    recentMovements,
  };
}

import { z } from "zod";

export const inventoryStockSchema = z.object({
  itemWarehouseId: z.number().int().positive("Requerido"),
  warehouseId: z.number().int().positive("Requerido"),
  stock: z.number().int().nonnegative({ message: "No negativo" }),
  stockMin: z.number().int().nonnegative({ message: "No negativo" }),
});

export type InventoryStockFormValues = z.infer<typeof inventoryStockSchema>;

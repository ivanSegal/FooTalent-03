import { z } from "zod";

export const inventoryWarehouseSchema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  location: z.string().trim().min(1, "Requerido"),
});

export type InventoryWarehouseFormValues = z.infer<typeof inventoryWarehouseSchema>;

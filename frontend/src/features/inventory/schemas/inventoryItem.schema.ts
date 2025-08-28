import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().min(2, "Descripción requerida"),
  stock: z.number().min(0, "No puede ser negativo"),
  stockMin: z.number().min(0, "No puede ser negativo"),
  warehouseName: z.string().min(2, "Depósito requerido"),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

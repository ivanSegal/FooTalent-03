import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  description: z.string().trim().min(1, "Requerido"),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

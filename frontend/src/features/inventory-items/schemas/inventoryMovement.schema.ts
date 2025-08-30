import { z } from "zod";

export const MOVEMENT_TYPES = ["ENTRADA", "SALIDA"] as const;

export const inventoryMovementSchema = z.object({
  warehouseId: z.number().int().positive("Requerido"),
  movementType: z.enum(MOVEMENT_TYPES),
  date: z.string().trim().min(1, "Requerido"), // YYYY-MM-DD
  reason: z.string().trim().optional().nullable(),
  responsibleId: z.string().trim().optional().nullable(),
  movementDetails: z
    .array(
      z.object({
        itemWarehouseId: z.number().int().positive("Requerido"),
        quantity: z.number().int().positive("Requerido"),
      }),
    )
    .min(1, "Agrega al menos un ítem"),
});

export type InventoryMovementFormValues = z.infer<typeof inventoryMovementSchema>;

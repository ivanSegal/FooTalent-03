import { z } from "zod";

export const inventoryWarehouseSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Ingrese un nombre válido" })
    .max(100, { message: "Máximo 100 caracteres" }),
  location: z
    .string()
    .min(3, { message: "Ingrese una ubicación válida" })
    .max(200, { message: "Máximo 200 caracteres" }),
});

export type InventoryWarehouseFormValues = z.infer<typeof inventoryWarehouseSchema>;

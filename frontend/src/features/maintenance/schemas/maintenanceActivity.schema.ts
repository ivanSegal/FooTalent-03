import { z } from "zod";

// Schema para el formulario de Actividad de Mantenimiento
export const maintenanceActivitySchema = z.object({
  id: z.number().int().positive().optional(),
  maintenanceOrder: z.string().trim().min(1, "Orden requerida"),
  activityType: z.string().trim().min(1, "Tipo requerido"),
  vesselItemName: z.string().trim().min(1, "Ítem requerido"),
  description: z.string().trim().min(1, "Descripción requerida"),
  inventoryMovementId: z.number().int().positive().nullable().optional(),
});

export type MaintenanceActivityFormValues = z.infer<typeof maintenanceActivitySchema>;

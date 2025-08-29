import { z } from "zod";

// Schema para el formulario de Actividad de Mantenimiento
export const maintenanceActivitySchema = z.object({
  id: z.number().int().positive().optional(),
  maintenanceOrder: z.string().trim().min(1, "Orden requerida"),
  activityType: z.string().trim().min(1, "Tipo requerido"),
  vesselItemId: z.number().int().positive({ message: "Ítem requerido" }),
  // opcional, solo para visualización/compatibilidad si el backend lo devuelve
  vesselItemName: z.string().trim().optional(),
  description: z.string().trim().min(1, "Descripción requerida"),
  // adaptado: ahora es una lista de movimientos
  inventoryMovementIds: z.array(z.number().int().positive()).optional().default([]),
  maintenanceOrderId: z.number().int().positive().optional(), // para crear nueva actividad vinculada a orden
});

// Usamos el tipo de entrada para alinear con el resolver de zod (que permite opcionales antes de aplicar defaults)
export type MaintenanceActivityFormValues = z.input<typeof maintenanceActivitySchema>;

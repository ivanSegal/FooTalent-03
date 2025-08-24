import { z } from "zod";

// Fechas en formato dd-MM-YYYY que envía el backend
const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;

// Este schema coincide 1:1 con MaintenanceListItem (backend)
export const maintenanceSchema = z.object({
  id: z.number().int().positive().optional(),
  // Permite ingresar "123" y lo convierte a number automáticamente
  vesselId: z.number().int().positive().optional(),
  vesselName: z.string().trim().min(1, "Requerido"),
  maintenanceType: z.string(),
  status: z.string(),
  maintenanceManager: z.string().optional(),
  maintenanceReason: z.string().nullable().optional(),
  // issuedAt: z.string().regex(ddmmyyyy, "dd-MM-YYYY").nullable().optional(),
  scheduledAt: z.string().regex(ddmmyyyy, "dd-MM-YYYY").nullable().optional(),
  startedAt: z.string().regex(ddmmyyyy, "dd-MM-YYYY").nullable().optional(),
  finishedAt: z.string().regex(ddmmyyyy, "dd-MM-YYYY").nullable().optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

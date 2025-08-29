import { z } from "zod";

export const vesselItemSchema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  description: z.string().trim().min(1, "Requerido"),
  controlType: z.string().trim().min(1, "Requerido"),
  accumulatedHours: z.number().int().nonnegative(),
  usefulLifeHours: z.number().int().nonnegative(),
  alertHours: z.number().int().nonnegative(),
  materialType: z.string().trim().min(1, "Requerido"),
});

export type VesselItemFormValues = z.infer<typeof vesselItemSchema>;

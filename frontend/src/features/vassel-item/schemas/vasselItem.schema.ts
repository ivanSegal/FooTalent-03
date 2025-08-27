import { z } from "zod";

const CONTROL_TYPES = [
  "NAVIGATION",
  "COMMUNICATION",
  "SAFETY",
  "ENGINE",
  "ELECTRICAL",
  "OTHER",
] as const;
const MATERIAL_TYPES = ["COMPONENTS", "CONSUMABLES", "SPARE_PARTS", "TOOLS", "OTHER"] as const;

export const vasselItemSchema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  description: z.string().trim().min(1, "Requerido"),
  controlType: z.enum(CONTROL_TYPES),
  accumulatedHours: z.number().int().nonnegative(),
  usefulLifeHours: z.number().int().nonnegative(),
  alertHours: z.number().int().nonnegative(),
  materialType: z.enum(MATERIAL_TYPES),
});

export type VasselItemFormValues = z.infer<typeof vasselItemSchema>;

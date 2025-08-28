import { z } from "zod";

export const vesselSchema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Requerido")
    .transform((s) => s.toUpperCase())
    .refine((v) => /^[A-Z0-9\-]+$/.test(v), {
      message: "Solo letras (A-Z), números (0-9) y guiones (-)",
    }),
  ismm: z
    .string()
    .trim()
    .min(1, "Requerido")
    .transform((s) => s.toUpperCase())
    .refine((v) => /^\d+$/.test(v) || /^ISM-\d{4}$/.test(v), {
      message: "Debe ser numérico o con formato ISM-####",
    }),
  flagState: z.string().trim().min(1, "Requerido"),
  callSign: z.string().trim().min(1, "Requerido"),
  portOfRegistry: z.string().trim().min(1, "Requerido"),
  rif: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine((v) => /^[JGVEP]-\d{8}-\d$/.test(v), {
      message: "Formato inválido. Use J-12345678-9",
    }),
  serviceType: z.string().trim().min(1, "Requerido"),
  constructionMaterial: z.string().trim().min(1, "Requerido"),
  sternType: z.string().trim().min(1, "Requerido"),
  fuelType: z.string().trim().min(1, "Requerido"),
  navigationHours: z
    .number()
    .int({ message: "Debe ser entero" })
    .nonnegative({ message: "No negativo" }),
});

export type VesselFormValues = z.infer<typeof vesselSchema>;

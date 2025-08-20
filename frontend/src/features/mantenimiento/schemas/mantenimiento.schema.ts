import { z } from "zod";

export const mantenimientoSchema = z
  .object({
    id: z.number().int().positive().optional(),
    embarcacion: z.string().min(1, "Requerido"),
    tarea: z.string().min(5, "Mínimo 5 caracteres"),
    responsable: z.string().optional(),
    fechaProgramada: z
      .string()
      .optional()
      .refine((v: string | undefined) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Formato inválido",
      }),
    fechaReal: z
      .string()
      .optional()
      .refine((v: string | undefined) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Formato inválido",
      }),
    estado: z.enum(["pendiente", "en_progreso", "completado"]),
    costo: z.number().nonnegative({ message: "Debe ser >= 0" }).optional(),
  })
  .refine(
    (data: { fechaProgramada?: string; fechaReal?: string }) => {
      if (data.fechaProgramada && data.fechaReal) {
        return new Date(data.fechaReal) >= new Date(data.fechaProgramada);
      }
      return true;
    },
    { message: "Fecha real debe ser >= programada", path: ["fechaReal"] },
  );

export type MantenimientoFormValues = z.infer<typeof mantenimientoSchema>;

import { z } from "zod";

// Formatos permitidos: "AAA-00-0" o "AAAA-00-0000"
// - 3 letras + 2 dígitos + 1 a 3 dígitos
// - 4 letras + 2 dígitos + 4 dígitos
const reportTravelNroRegex = /^(?:[A-Z]{3}-\d{2}-\d{1,3}|[A-Z]{4}-\d{2}-\d{4})$/;

export const serviceTicketSchema = z.object({
  travelNro: z.coerce.number().int().nonnegative(),
  travelDate: z.string().min(1, "Requerido"), // DD-MM-YYYY
  vesselAttended: z.string().min(1, "Requerido"),
  solicitedBy: z.string().min(1, "Requerido"),
  reportTravelNro: z
    .string()
    .trim()
    .regex(reportTravelNroRegex, "Formato inválido (AAA-00-0 o AAAA-00-0000, en MAYÚSCULAS)"),
  // code: z.string().min(1, "Requerido"),
  // checkingNro: z.coerce.number().int().nonnegative(),

  vesselName: z.string().min(1, "Requerido"),

  // Estado de la orden: true = Abierta, false = Cerrada
  status: z.boolean(),

  responsibleUsername: z.string().optional(),
});

export type ServiceTicketFormValues = z.infer<typeof serviceTicketSchema>;

import { z } from "zod";

export const serviceTicketSchema = z.object({
  travelNro: z.coerce.number().int().nonnegative(),
  travelDate: z.string().min(1, "Requerido"), // DD-MM-YYYY
  vesselAttended: z.string().min(1, "Requerido"),
  solicitedBy: z.string().min(1, "Requerido"),
  reportTravelNro: z.string().min(1, "Requerido"),
  code: z.string().min(1, "Requerido"),
  checkingNro: z.coerce.number().int().nonnegative(),
  boatName: z.string().min(1, "Requerido"),
  responsibleUsername: z.string().optional(),
});

export type ServiceTicketFormValues = z.infer<typeof serviceTicketSchema>;

import { z } from "zod";

export const serviceTicketDetailSchema = z.object({
  serviceTicketId: z.coerce.number().int().positive(),
  serviceArea: z.string().min(1, "Requerido"),
  serviceType: z.string().min(1, "Requerido"),
  description: z.string().min(1, "Requerido"),
  patronFullName: z.string().min(1, "Requerido"),
  marinerFullName: z.string().min(1, "Requerido"),
  captainFullName: z.string().min(1, "Requerido"),
});

export type ServiceTicketDetailInput = z.input<typeof serviceTicketDetailSchema>;
export type ServiceTicketDetailValues = z.output<typeof serviceTicketDetailSchema>;

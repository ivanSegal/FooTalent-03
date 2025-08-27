import { z } from "zod";

const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/; // 00-23:00-59

export const serviceTicketTravelSchema = z.object({
  origin: z.string().min(1, "Requerido"),
  destination: z.string().min(1, "Requerido"),
  departureTime: z.string().regex(hhmm, "Formato HH:mm"),
  arrivalTime: z.string().regex(hhmm, "Formato HH:mm"),
  serviceTicketDetailId: z.coerce.number().int().positive(),
});

export type ServiceTicketTravelInput = z.input<typeof serviceTicketTravelSchema>;
export type ServiceTicketTravelValues = z.output<typeof serviceTicketTravelSchema>;

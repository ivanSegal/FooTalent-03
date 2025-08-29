import { z } from "zod";

export const USER_ROLES = ["ADMIN", "SUPERVISOR", "OPERATOR"] as const;
export const USER_DEPARTMENTS = ["INVENTORY", "MAINTENANCE", "VESSEL"] as const;
export const ACCOUNT_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1, "Requerido"),
  lastName: z.string().min(1, "Requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(USER_ROLES),
  department: z.enum(USER_DEPARTMENTS).nullable().optional(),
  accountStatus: z.enum(ACCOUNT_STATUSES),
});

export type UserInput = z.input<typeof userSchema>;
export type UserValues = z.output<typeof userSchema>;

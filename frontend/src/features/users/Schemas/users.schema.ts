// users/schemas/users.schema.ts
import { z } from 'zod';

// Schema para crear usuario
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),

  email: z
    .string()
    .email('Ingrese un email válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede exceder 100 caracteres'),

  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
    ),

  role: z.enum(['ADMIN', 'SUPERVISOR', 'OPERATOR'], {
    message: 'Seleccione un rol válido'
  }),

  department: z.string().optional(),
});

// Schema para actualizar usuario
export const updateUserSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  role: z.string().min(1, "El rol es requerido"), 
  department: z.string().min(1, "El departamento es requerido"),
  accountStatus: z.string().min(1, "El estado es requerido"),
});

// Schema para filtros de usuarios
export const userFiltersSchema = z.object({
  role: z.enum(['ADMIN', 'SUPERVISOR', 'OPERATOR']).optional(),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  department: z.string().optional(),
  search: z.string().optional(),
});

// Schema para parámetros de paginación
export const paginationParamsSchema = z.object({
  page: z.number().min(0, 'La página debe ser mayor o igual a 0'),
  size: z.number().min(1, 'El tamaño de página debe ser mayor a 0').max(100, 'El tamaño de página no puede exceder 100'),
});

// Tipos inferidos
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
export type UserFiltersForm = z.infer<typeof userFiltersSchema>;
export type PaginationParamsForm = z.infer<typeof paginationParamsSchema>;

// Constantes para roles
export const USER_ROLES = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Encargado',
  OPERATOR: 'Personal'
} as const;

// Constantes para estados de cuenta
export const ACCOUNT_STATUS = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  SUSPENDED: 'Suspendido'
} as const;

// Validaciones adicionales
export const validateEmail = (email: string): boolean => {
  return createUserSchema.shape.email.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return createUserSchema.shape.password.safeParse(password).success;
};
;

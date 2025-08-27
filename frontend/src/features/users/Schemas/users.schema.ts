// users/schemas/users.schema.ts

import { z } from 'zod';

// Schema para crear usuario
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),
  
  fullName: z
    .string()
    .min(2, 'El nombre completo debe tener al menos 2 caracteres')
    .max(100, 'El nombre completo no puede exceder 100 caracteres'),
  
  email: z
    .string()
    .email('Ingrese un email válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede exceder 100 caracteres'),
  
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  
  role: z.enum(['ADMIN', 'SUPERVISOR', 'OPERATOR'], {
  message: 'Seleccione un rol válido'
}),
  department: z.string().optional(),
});

// Schema para actualizar usuario
export const updateUserSchema = createUserSchema.partial().extend({
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
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

export const validateUsername = (username: string): boolean => {
  return createUserSchema.shape.username.safeParse(username).success;
};
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Debe contener: una minúscula, una mayúscula, un número y un carácter especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Schema para actualización de perfil 
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
      "El apellido solo puede contener letras y espacios"
    ),
});

// Schema para reset de contraseña
export const resetPasswordSchema = z.object({
  email: z.string().email("Formato de email inválido").toLowerCase(),
});

// Tipos inferidos de los schemas
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
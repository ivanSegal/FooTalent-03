// Modelo base de usuario
export type AuthUser = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
};

// Login
export type LoginRequest = {
  email: string;
  password: string;
};

// Registro
export type RegisterRequest = Omit<AuthUser, "id">;

// Forgot password
export type ForgotPasswordRequest = Pick<AuthUser, "email">;

// Reset password
export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

// Change password
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

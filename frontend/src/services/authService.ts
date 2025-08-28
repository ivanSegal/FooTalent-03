import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";

import api from "./api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

// Guardamos el token como cookie accesible por middleware
const saveTokenInCookie = (token: string) => {
  Cookies.set("token", token, {
    path: "/",
    secure: true,
    sameSite: "Strict",
  });
};

// Hacemos login y devolvemos el token
export const login = async (
  credentials: LoginRequest,
): Promise<{ token: string; email?: string }> => {
  const loginPayload = {
    // Backend aún espera { username, password }
    email: credentials.email,
    password: credentials.password,
  };
  console.log("loginPayload:", loginPayload);
  const { data: payload } = await api.post<ApiResponse<{ token: string }>>(
    "/auth/login",
    loginPayload,
  );
  console.log("Login response data:", payload);

  const token = payload.data?.token;
  if (!token) throw new Error("No se recibió token en la respuesta de login");

  saveTokenInCookie(token);
  // Decodifica el token para obtener el email
  let email: string | undefined = undefined;
  try {
    const decoded = jwtDecode<{ email?: string; username?: string }>(token);
    console.log("Decoded JWT:", decoded);
    email = decoded.email ?? decoded.username;
  } catch (err) {
    console.warn("No se pudo decodificar el token JWT", err);
  }
  return { token, email };
};
// Servicio para solicitar recuperación de contraseña
export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<{ success: boolean; message: string }> => {
  const { data: body } = await api.post<{ success: boolean; message: string }>(
    "/auth/forgot-password",
    data,
  );
  return body;
};
// Registro de usuario
export const register = async (data: RegisterRequest): Promise<ApiResponse<unknown>> => {
  // Backend espera { email, role, firstName, lastName, department }
  const registerPayload = {
    email: data.email,
    role: data.role,
    firstName: data.firstName,
    lastName: data.lastName,
    department: data.department,
  };
  console.log("registerPayload:", registerPayload);
  const { data: body } = await api.post<ApiResponse<unknown>>("/auth/register", registerPayload);
  console.log("Register response data:", body);
  return body;
};

// Restablecer contraseña con token
export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<{ success: boolean; message: string }> => {
  const { data: body } = await api.post<{ success: boolean; message: string }>(
    "/auth/reset-password",
    data,
  );
  return body;
};

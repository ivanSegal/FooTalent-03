import { AuthUser } from "../types/auth";
import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Guardamos el JWT en cookie para que el middleware lo lea
const saveToken = (token: string) => {
  document.cookie = `token=${token}; path=/; SameSite=None; Secure;`;
};

// Hacemos login y devolvemos el token
export const login = async (
  credentials: Pick<AuthUser, "username" | "password">,
): Promise<{ token: string }> => {
  // Tipamos la respuesta como ApiResponse<{ token: string }>
  const { data: payload } = await api.post<ApiResponse<{ token: string }>>(
    "/auth/login",
    credentials,
  );
  console.log("Login response data:", payload);

  const token = payload.data.token;
  if (!token) {
    throw new Error("No se recibió token en la respuesta de login");
  }

  saveToken(token);
  return { token };
};

// Registramos un usuario y devolvemos el body completo de la API
export const register = async (
  data: Pick<AuthUser, "username" | "password" | "confirmPassword" | "role">,
): Promise<ApiResponse<unknown>> => {
  // Tipamos la respuesta como ApiResponse<unknown>
  const { data: body } = await api.post<ApiResponse<unknown>>("/auth/register", data);
  console.log("Register response data:", body);
  return body;
};

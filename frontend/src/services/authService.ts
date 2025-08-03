import { AuthUser } from "../types/auth";
import api from "./api";
import Cookies from "js-cookie";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
  credentials: Pick<AuthUser, "username" | "password">,
): Promise<{ token: string }> => {
  const { data: payload } = await api.post<ApiResponse<{ token: string }>>(
    "/auth/login",
    credentials,
  );
  console.log("Login response data:", payload);

  const token = payload.data.token;
  if (!token) throw new Error("No se recibió token en la respuesta de login");

  saveTokenInCookie(token);
  return { token };
};

// Registro de usuario
export const register = async (
  data: Pick<AuthUser, "username" | "password" | "confirmPassword" | "role">,
): Promise<ApiResponse<unknown>> => {
  const { data: body } = await api.post<ApiResponse<unknown>>("/auth/register", data);
  console.log("Register response data:", body);
  return body;
};

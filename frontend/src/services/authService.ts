import { AuthUser } from "../types/auth";
import api from "./api";

const saveToken = (token: string) => {
  // Guardamos el JWT en cookie para que el middleware lo lea
  document.cookie = `token=${token}; path=/; samesite=Lax;`;
};

export const login = async (
  credentials: Pick<AuthUser, "username" | "password">
): Promise<{ token: string }> => {
  // Llamamos al endpoint
  const response = await api.post("/auth/login", credentials);


  const payload = response.data;
  console.log("Login response data:", payload);

  // Extraemos el token de payload.data.token
  const token = payload.data.token;
  if (token) {
    saveToken(token);
  } else {
    throw new Error("No se recibió token en la respuesta");
  }

  // Devolvemos el token
  return { token };
};

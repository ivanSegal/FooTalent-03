import { AuthUser } from "../types/auth";
import api from "./api";

export const register = async (data: AuthUser) => {
  const response = await api.post("/auth/register", data);
  return response.data as AuthUser;
};

export const login = async (data: Pick<AuthUser, "email" | "password">) => {
  const response = await api.post("/auth/login", data);
  return response.data as AuthUser;
};

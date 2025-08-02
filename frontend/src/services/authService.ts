import { AuthUser } from "../types/auth";
import api from "./api";

const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const register = async (data: AuthUser) => {
  const response = await api.post("/auth/register", data);
  console.log("Data being sent to register:", data);

  const result = response.data as AuthUser;

  if (result.token) {
    saveToken(result.token);
  }
  console.log("User registered successfully:", result);
  return result;
};

export const login = async (data: Pick<AuthUser, "email" | "password">) => {
  const response = await api.post("/auth/login", data);
  const result = response.data as AuthUser;

  if (result.token) {
    saveToken(result.token);
  }
  console.log("User logged in successfully:", result);
  return result;
};

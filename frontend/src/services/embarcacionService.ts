import axios from "axios";
import Cookies from "js-cookie";
import { Embarcacion } from "@/types/embarcacion";

export const getAllEmbarcaciones = async (): Promise<Embarcacion[]> => {
  const token = Cookies.get("token");

  if (!token) throw new Error("Token no encontrado");

  const response = await axios.get("https://footalent-03.onrender.com/api/embarcaciones", {
    headers: {
      Authorization: `Bearer ${token}`, // Enviar token en el header
    },
  });

  return response.data;
};

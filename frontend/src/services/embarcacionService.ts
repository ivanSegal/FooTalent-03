import axios from "axios";
import Cookies from "js-cookie";
import { Embarcacion } from "@/types/embarcacion";

const BASE_URL = "https://footalent-03.onrender.com/api/embarcaciones";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Token no encontrado");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Obtener todas las embarcaciones
export const getAllEmbarcaciones = async (): Promise<Embarcacion[]> => {
  const response = await axios.get(BASE_URL, getAuthHeaders());
  return response.data;
};

// Crear nueva embarcación
export const createEmbarcacion = async (data: Partial<Embarcacion>): Promise<Embarcacion> => {
  const response = await axios.post(BASE_URL, data, getAuthHeaders());
  return response.data;
};

// Actualizar embarcación existente
export const updateEmbarcacion = async (
  id: number,
  data: Partial<Embarcacion>,
): Promise<Embarcacion> => {
  const response = await axios.put(`${BASE_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

// Eliminar embarcación
export const deleteEmbarcacion = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
};

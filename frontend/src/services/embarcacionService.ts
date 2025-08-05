import { Embarcacion } from "@/types/embarcacion";
import api from "./api";

// Obtener todas las embarcaciones
export const getAllEmbarcaciones = async (): Promise<Embarcacion[]> => {
  const response = await api.get<Embarcacion[]>("/api/embarcaciones");

  return response.data;
};

// Crear nueva embarcación
export const createEmbarcacion = async (data: Partial<Embarcacion>): Promise<Embarcacion> => {
  const response = await api.post<Embarcacion>("/api/embarcaciones", data);
  return response.data;
};

// Actualizar embarcación existente
export const updateEmbarcacion = async (
  id: number,
  data: Partial<Embarcacion>,
): Promise<Embarcacion> => {
  const response = await api.put<Embarcacion>(`/api/embarcaciones/${id}`, data);
  return response.data;
};

// Eliminar embarcación
export const deleteEmbarcacion = async (id: number): Promise<void> => {
  await api.delete(`/api/embarcaciones/${id}`);
};

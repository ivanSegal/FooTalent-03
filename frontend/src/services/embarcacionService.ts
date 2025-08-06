import { Embarcacion } from "@/types/embarcacion";
import { Paginacion } from "@/types/paginacion";
import api from "./api";

// Obtener todas las embarcaciones
export const getAllEmbarcaciones = async (): Promise<Embarcacion[]> => {
  let embarcaciones: Embarcacion[] = [];
  let page = 0;
  let last = false;
  do {
    const response = await api.get<Paginacion<Embarcacion>>(`/api/embarcaciones?page=${page}`);
    embarcaciones.push(...response.data.content);
    last = response.data.last;
    page++;
  } while (!last);
  return embarcaciones;
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

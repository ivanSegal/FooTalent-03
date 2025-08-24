import type { PageResponse, MaintenanceListItem } from "@/features/maintenance";
import api from "@/services/api";

const BASE = "/ordenes-mantenimiento"; // ruta base actualizada

export interface ListParams {
  page?: number; // 0-based
  size?: number; // page size
  sort?: string | string[]; // e.g. "issuedAt,desc" o ["status,asc", "issuedAt,desc"]
  search?: string; // optional search term
  status?: string; // filter by status
}

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

function isApiResult<T>(val: unknown): val is ApiResult<T> {
  return (
    !!val &&
    typeof val === "object" &&
    "data" in (val as Record<string, unknown>) &&
    "success" in (val as Record<string, unknown>)
  );
}

function unwrap<T>(resp: T | ApiResult<T>): T {
  return isApiResult<T>(resp) ? resp.data : (resp as T);
}

export const maintenanceService = {
  async list(params: ListParams = {}): Promise<PageResponse<MaintenanceListItem>> {
    const { page = 0, size = 20, sort, search, status } = params;
    const { data } = await api.get<PageResponse<MaintenanceListItem>>(BASE, {
      params: { page, size, sort, search, status },
    });
    return data;
  },

  async getById(id: number): Promise<MaintenanceListItem> {
    const { data } = await api.get<MaintenanceListItem | ApiResult<MaintenanceListItem>>(
      `${BASE}/${id}`,
    );
    return unwrap<MaintenanceListItem>(data);
  },

  async create(payload: Partial<MaintenanceListItem>): Promise<MaintenanceListItem> {
    console.log("Creating maintenance order with payload:", payload);
    const { data } = await api.post<MaintenanceListItem | ApiResult<MaintenanceListItem>>(
      BASE,
      payload,
    );
    return unwrap<MaintenanceListItem>(data);
  },

  async update(id: number, payload: Partial<MaintenanceListItem>): Promise<MaintenanceListItem> {
    console.log("Editing maintenance order with payload:", payload);

    const { data } = await api.put<MaintenanceListItem | ApiResult<MaintenanceListItem>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<MaintenanceListItem>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

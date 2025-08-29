import api from "@/services/api";
import { PageResponse } from "../types/maintenance.types";
import { MaintenanceActivityItem } from "../types/maintenanceActivities.types";

const BASE = "/actividades-mantenimiento";

interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
}

interface ApiResult<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isApiResult<T>(val: unknown): val is ApiResult<T> {
  return !!val && typeof val === "object" && "data" in (val as Record<string, unknown>);
}

function unwrap<T>(resp: T | ApiResult<T>): T {
  return isApiResult<T>(resp) ? resp.data : (resp as T);
}

export const maintenanceActivitiesService = {
  async list(params: ListParams = {}): Promise<PageResponse<MaintenanceActivityItem>> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<
      PageResponse<MaintenanceActivityItem> | ApiResult<PageResponse<MaintenanceActivityItem>>
    >(BASE, {
      params: { page, size, sort, search },
    });
    return unwrap<PageResponse<MaintenanceActivityItem>>(data);
  },

  async getById(id: number): Promise<MaintenanceActivityItem> {
    const { data } = await api.get<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      `${BASE}/${id}`,
    );
    return unwrap<MaintenanceActivityItem>(data);
  },

  async create(payload: Partial<MaintenanceActivityItem>): Promise<MaintenanceActivityItem> {
    const { data } = await api.post<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      BASE,
      payload,
    );
    return unwrap<MaintenanceActivityItem>(data);
  },

  async update(
    id: number,
    payload: Partial<MaintenanceActivityItem>,
  ): Promise<MaintenanceActivityItem> {
    const { data } = await api.put<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<MaintenanceActivityItem>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default maintenanceActivitiesService;

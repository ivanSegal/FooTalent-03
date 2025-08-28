import api from "@/services/api";
import type { Vessel, VesselPage } from "@/features/vessels/types/vessel.types";

const BASE = "/vessels";

export interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
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

export const vesselsService = {
  async list(params: ListParams = {}): Promise<VesselPage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<VesselPage | ApiResult<VesselPage>>(BASE, {
      params: { page, size, sort, search },
    });
    return unwrap<VesselPage>(data);
  },

  async getById(id: number): Promise<Vessel> {
    const { data } = await api.get<Vessel | ApiResult<Vessel>>(`${BASE}/${id}`);
    return unwrap<Vessel>(data);
  },

  async create(payload: Partial<Vessel>): Promise<Vessel> {
    const { data } = await api.post<Vessel | ApiResult<Vessel>>(`${BASE}/create`, payload);
    return unwrap<Vessel>(data);
  },

  async update(id: number, payload: Partial<Vessel>): Promise<Vessel> {
    const { data } = await api.put<Vessel | ApiResult<Vessel>>(`${BASE}/${id}`, payload);
    return unwrap<Vessel>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default vesselsService;

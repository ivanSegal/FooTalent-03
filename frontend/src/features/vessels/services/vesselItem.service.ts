import api from "@/services/api";
import type { VesselItem, VesselItemPage } from "@/features/vessels/types/vesselItem.types";

const BASE = "/vessel-item";

interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
  vesselId?: number;
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

export const vesselItemService = {
  async list(params: ListParams = {}): Promise<VesselItemPage> {
    const { page = 0, size = 20, sort, search, vesselId } = params;
    const { data } = await api.get<VesselItemPage | ApiResult<VesselItemPage>>(BASE, {
      params: { page, size, sort, search, vesselId },
    });
    return unwrap<VesselItemPage>(data);
  },

  async getById(id: number): Promise<VesselItem> {
    const { data } = await api.get<VesselItem | ApiResult<VesselItem>>(`${BASE}/${id}`);
    return unwrap<VesselItem>(data);
  },

  async create(payload: Partial<VesselItem> & { vesselId: number }): Promise<VesselItem> {
    const { data } = await api.post<VesselItem | ApiResult<VesselItem>>(`${BASE}`, payload);
    return unwrap<VesselItem>(data);
  },

  async update(id: number, payload: Partial<VesselItem>): Promise<VesselItem> {
    const { data } = await api.put<VesselItem | ApiResult<VesselItem>>(`${BASE}/${id}`, payload);
    return unwrap<VesselItem>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default vesselItemService;

import api from "@/services/api";
import type { VasselItem, VasselItemPage } from "@/features/vassel-item/types/vasselItem.types";

const BASE = "/vassel-item";

export interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
  vasselId?: number;
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

export const vasselItemService = {
  async list(params: ListParams = {}): Promise<VasselItemPage> {
    const { page = 0, size = 20, sort, search, vasselId } = params;
    const { data } = await api.get<VasselItemPage | ApiResult<VasselItemPage>>(BASE, {
      params: { page, size, sort, search, vasselId },
    });
    return unwrap<VasselItemPage>(data);
  },

  async getById(id: number): Promise<VasselItem> {
    const { data } = await api.get<VasselItem | ApiResult<VasselItem>>(`${BASE}/${id}`);
    return unwrap<VasselItem>(data);
  },

  async create(payload: Partial<VasselItem> & { vasselId: number }): Promise<VasselItem> {
    const { data } = await api.post<VasselItem | ApiResult<VasselItem>>(`${BASE}/create`, payload);
    return unwrap<VasselItem>(data);
  },

  async update(id: number, payload: Partial<VasselItem>): Promise<VasselItem> {
    const { data } = await api.put<VasselItem | ApiResult<VasselItem>>(`${BASE}/${id}`, payload);
    return unwrap<VasselItem>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default vasselItemService;

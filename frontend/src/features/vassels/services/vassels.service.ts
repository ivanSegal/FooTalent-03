import api from "@/services/api";
import type { Vassel, VasselPage } from "@/features/vassels/types/vassel.types";

const BASE = "/vassels";

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

export const vasselsService = {
  async list(params: ListParams = {}): Promise<VasselPage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<VasselPage | ApiResult<VasselPage>>(BASE, {
      params: { page, size, sort, search },
    });
    return unwrap<VasselPage>(data);
  },

  async getById(id: number): Promise<Vassel> {
    const { data } = await api.get<Vassel | ApiResult<Vassel>>(`${BASE}/${id}`);
    return unwrap<Vassel>(data);
  },
};

export default vasselsService;

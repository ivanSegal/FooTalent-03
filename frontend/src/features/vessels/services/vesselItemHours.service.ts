import api from "@/services/api";
import type {
  VesselItemHoursRequest,
  VesselItemHoursResponse,
  VesselItemHoursPage,
} from "@/features/vessels/types/vesselItemHours.types";

const BASE = "/vessel-item-hours";

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

export const vesselItemHoursService = {
  async list(
    params: {
      page?: number;
      size?: number;
      sort?: string | string[];
      vesselId?: number;
      fromDate?: string; // DD-MM-YYYY
      toDate?: string; // DD-MM-YYYY
    } = {},
  ): Promise<VesselItemHoursPage> {
    const { page = 0, size = 20, sort, vesselId, fromDate, toDate } = params;
    const { data } = await api.get<VesselItemHoursPage | ApiResult<VesselItemHoursPage>>(BASE, {
      params: { page, size, sort, vesselId, fromDate, toDate },
    });
    return unwrap<VesselItemHoursPage>(data);
  },

  async create(payload: VesselItemHoursRequest): Promise<VesselItemHoursResponse | void> {
    const { data } = await api.post<VesselItemHoursResponse | ApiResult<VesselItemHoursResponse>>(
      BASE,
      payload,
    );
    try {
      return unwrap<VesselItemHoursResponse>(data);
    } catch {
      return undefined;
    }
  },

  async update(
    id: number,
    payload: VesselItemHoursRequest,
  ): Promise<VesselItemHoursResponse | void> {
    const { data } = await api.put<VesselItemHoursResponse | ApiResult<VesselItemHoursResponse>>(
      `${BASE}/${id}`,
      payload,
    );
    try {
      return unwrap<VesselItemHoursResponse>(data);
    } catch {
      return undefined;
    }
  },
};

export default vesselItemHoursService;

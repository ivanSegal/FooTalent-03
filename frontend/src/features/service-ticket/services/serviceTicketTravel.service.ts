import api from "@/services/api";
import type {
  ServiceTicketTravel,
  CreateServiceTicketTravelPayload,
  UpdateServiceTicketTravelPayload,
} from "@/features/service-ticket/types/serviceTicketTravel.types";

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

function isApiResult<T>(val: unknown): val is ApiResult<T> {
  return !!val && typeof val === "object" && "data" in (val as Record<string, unknown>);
}

function unwrap<T>(resp: T | ApiResult<T>): T {
  return isApiResult<T>(resp) ? resp.data : (resp as T);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

function normalizeArrayResponse<T>(val: unknown): T[] {
  const data = isApiResult<unknown>(val) ? val.data : val;
  if (Array.isArray(data)) return data as T[];
  if (isRecord(data) && Array.isArray((data as { content?: unknown[] }).content)) {
    return (data as { content: unknown[] }).content as T[];
  }
  if (isRecord(data) && Object.keys(data).length > 0) return [data as T];
  return [];
}

const TRAVEL_BASE = "/travels";

export const serviceTicketTravelService = {
  async create(payload: CreateServiceTicketTravelPayload): Promise<ServiceTicketTravel> {
    const { data } = await api.post<ServiceTicketTravel | ApiResult<ServiceTicketTravel>>(
      TRAVEL_BASE,
      payload,
    );
    return unwrap<ServiceTicketTravel>(data);
  },
  async update(
    id: number,
    payload: UpdateServiceTicketTravelPayload,
  ): Promise<ServiceTicketTravel> {
    const { data } = await api.put<ServiceTicketTravel | ApiResult<ServiceTicketTravel>>(
      `${TRAVEL_BASE}/${id}`,
      payload,
    );
    return unwrap<ServiceTicketTravel>(data);
  },
  async getById(id: number): Promise<ServiceTicketTravel> {
    const { data } = await api.get<ServiceTicketTravel | ApiResult<ServiceTicketTravel>>(
      `${TRAVEL_BASE}/${id}`,
    );
    return unwrap<ServiceTicketTravel>(data);
  },
  async listByDetail(serviceTicketDetailId: number): Promise<ServiceTicketTravel[]> {
    const { data } = await api.get<unknown>(`${TRAVEL_BASE}/detail/${serviceTicketDetailId}`);
    return normalizeArrayResponse<ServiceTicketTravel>(data);
  },
  async remove(id: number): Promise<void> {
    await api.delete(`${TRAVEL_BASE}/${id}`);
  },
};

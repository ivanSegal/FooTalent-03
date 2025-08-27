import api from "@/services/api";
import type {
  ServiceTicketDetail,
  CreateServiceTicketDetailPayload,
  UpdateServiceTicketDetailPayload,
} from "@/features/service-ticket/types/serviceTicketDetail.types";

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
  if (isRecord(data) && Array.isArray((data as Record<string, unknown>).content))
    return (data as Record<string, unknown>).content as T[];
  if (isRecord(data) && Object.keys(data).length > 0) return [data as T];
  return [];
}

const DETAIL_BASE = "/boleta-servicio-detalle";

export const serviceTicketDetailService = {
  async create(payload: CreateServiceTicketDetailPayload): Promise<ServiceTicketDetail> {
    const { data } = await api.post<ServiceTicketDetail | ApiResult<ServiceTicketDetail>>(
      DETAIL_BASE,
      payload,
    );
    return unwrap<ServiceTicketDetail>(data);
  },
  async update(
    id: number,
    payload: UpdateServiceTicketDetailPayload,
  ): Promise<ServiceTicketDetail> {
    const { data } = await api.put<ServiceTicketDetail | ApiResult<ServiceTicketDetail>>(
      `${DETAIL_BASE}/${id}`,
      payload,
    );
    return unwrap<ServiceTicketDetail>(data);
  },
  async getById(id: number): Promise<ServiceTicketDetail> {
    const { data } = await api.get<ServiceTicketDetail | ApiResult<ServiceTicketDetail>>(
      `${DETAIL_BASE}/${id}`,
    );
    return unwrap<ServiceTicketDetail>(data);
  },
  async listByServiceTicket(serviceTicketId: number): Promise<ServiceTicketDetail[]> {
    const { data } = await api.get<unknown>(`${DETAIL_BASE}/by-ticket/${serviceTicketId}`);
    return normalizeArrayResponse<ServiceTicketDetail>(data);
  },
  async getOneByServiceTicket(serviceTicketId: number): Promise<ServiceTicketDetail | null> {
    const list = await this.listByServiceTicket(serviceTicketId);
    return list.length > 0 ? list[0] : null;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`${DETAIL_BASE}/${id}`);
  },
};

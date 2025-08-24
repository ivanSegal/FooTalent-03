import api from "@/services/api";
import type {
  ServiceTicketListItem,
  ServiceTicketPage,
} from "@/features/service-ticket/types/serviceTicket.types";

const BASE = "/boleta-servicio";

export interface ListParams {
  page?: number; // 0-based
  size?: number; // page size
  sort?: string | string[]; // e.g. "travelDate,desc"
  search?: string; // optional search term
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

export const serviceTicketService = {
  async list(params: ListParams = {}): Promise<ServiceTicketPage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<ServiceTicketPage>(BASE, {
      params: { page, size, sort, search },
    });
    return data;
  },
  async getById(id: number): Promise<ServiceTicketListItem> {
    const { data } = await api.get<ServiceTicketListItem | ApiResult<ServiceTicketListItem>>(
      `${BASE}/${id}`,
    );
    return unwrap<ServiceTicketListItem>(data);
  },
  async create(payload: Partial<ServiceTicketListItem>): Promise<ServiceTicketListItem> {
    console.log("Creating service ticket with payload:", payload);
    const { data } = await api.post<ServiceTicketListItem | ApiResult<ServiceTicketListItem>>(
      BASE,
      payload,
    );
    return unwrap<ServiceTicketListItem>(data);
  },
  async update(
    id: number,
    payload: Partial<ServiceTicketListItem>,
  ): Promise<ServiceTicketListItem> {
    const { data } = await api.put<ServiceTicketListItem | ApiResult<ServiceTicketListItem>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<ServiceTicketListItem>(data);
  },
  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

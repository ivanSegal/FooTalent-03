import api from "@/services/api";
import type { PageResponse } from "@/features/user/types/user.types";
import type { UserListItem } from "@/features/user/types/user.types";

const BASE = "/users"; // ajustar si el backend expone otra ruta

const BASE2 = "/auth/register"; // ajustar si el backend expone otra ruta

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

function isApiResult<T>(val: unknown): val is ApiResult<T> {
  return !!val && typeof val === "object" && "data" in (val as Record<string, unknown>);
}

function unwrap<T>(resp: T | ApiResult<T>): T {
  return isApiResult<T>(resp) ? (resp as ApiResult<T>).data : (resp as T);
}

export interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
  role?: string;
  department?: string;
  status?: string;
}

// Payload without id
type UserPayload = Omit<UserListItem, "id">;

export const userService = {
  async list(params: ListParams = {}): Promise<PageResponse<UserListItem>> {
    const { page = 0, size = 20, sort, search, role, department, status } = params;
    const { data } = await api.get<
      PageResponse<UserListItem> | ApiResult<PageResponse<UserListItem>>
    >(BASE, {
      params: { page, size, sort, search, role, department, status },
    });
    return unwrap<PageResponse<UserListItem>>(data);
  },

  async getById(id: string): Promise<UserListItem> {
    const { data } = await api.get<UserListItem | ApiResult<UserListItem>>(`${BASE}/${id}`);
    return unwrap<UserListItem>(data);
  },

  async create(payload: Partial<UserPayload>): Promise<UserListItem> {
    const { data } = await api.post<UserListItem | ApiResult<UserListItem>>(BASE2, payload);
    return unwrap<UserListItem>(data);
  },

  async update(id: string, payload: Partial<UserPayload>): Promise<UserListItem> {
    const { data } = await api.put<UserListItem | ApiResult<UserListItem>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<UserListItem>(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

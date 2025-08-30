import api from "@/services/api";
import type {
  InventoryItem,
  InventoryItemPage,
} from "@/features/inventory-items/types/inventoryItem.types";

const BASE = "/items/warehouses"; // ruta indicada por el backend

interface ListParams {
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

export const inventoryItemService = {
  async list(params: ListParams = {}): Promise<InventoryItemPage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<InventoryItemPage | ApiResult<InventoryItemPage>>(BASE, {
      params: { page, size, sort, search },
    });
    return unwrap<InventoryItemPage>(data);
  },

  async getById(id: number): Promise<InventoryItem> {
    const { data } = await api.get<InventoryItem | ApiResult<InventoryItem>>(`${BASE}/${id}`);
    return unwrap<InventoryItem>(data);
  },

  async create(payload: Partial<InventoryItem>): Promise<InventoryItem> {
    const { data } = await api.post<InventoryItem | ApiResult<InventoryItem>>(
      `${BASE}/create`,
      payload,
    );
    return unwrap<InventoryItem>(data);
  },

  async update(id: number, payload: Partial<InventoryItem>): Promise<InventoryItem> {
    const { data } = await api.put<InventoryItem | ApiResult<InventoryItem>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<InventoryItem>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default inventoryItemService;

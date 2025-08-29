import api from "@/services/api";
import type {
  InventoryStockPage,
  InventoryStockRow,
} from "@/features/inventory-items/types/inventoryStock.types";

const BASE = "/stocks";

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

export const inventoryStockService = {
  async list(params: ListParams = {}): Promise<InventoryStockPage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<InventoryStockPage | ApiResult<InventoryStockPage>>(BASE, {
      params: { page, size, sort, search },
    });
    return unwrap<InventoryStockPage>(data);
  },

  async getById(id: number): Promise<InventoryStockRow> {
    const { data } = await api.get<InventoryStockRow | ApiResult<InventoryStockRow>>(
      `${BASE}/${id}`,
    );
    return unwrap<InventoryStockRow>(data);
  },

  async create(payload: Partial<InventoryStockRow>): Promise<InventoryStockRow> {
    const { data } = await api.post<InventoryStockRow | ApiResult<InventoryStockRow>>(
      `${BASE}/create`,
      payload,
    );
    return unwrap<InventoryStockRow>(data);
  },

  async update(id: number, payload: Partial<InventoryStockRow>): Promise<InventoryStockRow> {
    const { data } = await api.put<InventoryStockRow | ApiResult<InventoryStockRow>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<InventoryStockRow>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default inventoryStockService;

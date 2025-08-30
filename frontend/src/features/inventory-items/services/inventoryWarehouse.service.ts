import api from "@/services/api";
import type {
  InventoryWarehouse,
  InventoryWarehousePage,
} from "@/features/inventory-items/types/inventoryWarehouse.types";

const BASE = "/warehouses";

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

export const inventoryWarehouseService = {
  async list(params: ListParams = {}): Promise<InventoryWarehousePage> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<InventoryWarehousePage | ApiResult<InventoryWarehousePage>>(
      BASE,
      {
        params: { page, size, sort, search },
      },
    );
    return unwrap<InventoryWarehousePage>(data);
  },

  async getById(id: number): Promise<InventoryWarehouse> {
    const { data } = await api.get<InventoryWarehouse | ApiResult<InventoryWarehouse>>(
      `${BASE}/${id}`,
    );
    return unwrap<InventoryWarehouse>(data);
  },

  async create(payload: Partial<InventoryWarehouse>): Promise<InventoryWarehouse> {
    const { data } = await api.post<InventoryWarehouse | ApiResult<InventoryWarehouse>>(
      `${BASE}/create`,
      payload,
    );
    return unwrap<InventoryWarehouse>(data);
  },

  async update(id: number, payload: Partial<InventoryWarehouse>): Promise<InventoryWarehouse> {
    const { data } = await api.put<InventoryWarehouse | ApiResult<InventoryWarehouse>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<InventoryWarehouse>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default inventoryWarehouseService;

import api from "@/services/api";
import type {
  InventoryMovement,
  InventoryMovementPage,
  InventoryMovementRequest,
} from "@/features/inventory-items/types/inventoryMovement.types";

const BASE = "/inventory-movement";

interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  warehouseId?: number;
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

export const inventoryMovementService = {
  async list(params: ListParams = {}): Promise<InventoryMovementPage> {
    const { page = 0, size = 20, sort, search, fromDate, toDate, warehouseId } = params;
    const { data } = await api.get<InventoryMovementPage | ApiResult<InventoryMovementPage>>(BASE, {
      params: { page, size, sort, search, fromDate, toDate, warehouseId },
    });
    return unwrap<InventoryMovementPage>(data);
  },

  async getById(id: number): Promise<InventoryMovement> {
    const { data } = await api.get<InventoryMovement | ApiResult<InventoryMovement>>(
      `${BASE}/${id}`,
    );
    return unwrap<InventoryMovement>(data);
  },

  async create(payload: InventoryMovementRequest): Promise<InventoryMovement> {
    const { data } = await api.post<InventoryMovement | ApiResult<InventoryMovement>>(
      `${BASE}/create`,
      payload,
    );
    return unwrap<InventoryMovement>(data);
  },

  async update(id: number, payload: InventoryMovementRequest): Promise<InventoryMovement> {
    const { data } = await api.put<InventoryMovement | ApiResult<InventoryMovement>>(
      `${BASE}/${id}`,
      payload,
    );
    return unwrap<InventoryMovement>(data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default inventoryMovementService;

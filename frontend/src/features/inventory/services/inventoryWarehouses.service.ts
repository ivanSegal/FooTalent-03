import api from "@/services/api";
import type {
  Warehouse,
  WarehousePage,
} from "@/features/inventory/types/inventoryWarehouses.types";

const BASE = "/warehouses";

export const inventoryWarehousesService = {
  async list(params?: {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
  }): Promise<WarehousePage> {
    const { page = 0, size = 20, sort, search } = params || {};
    const { data } = await api.get<
      WarehousePage | { success: boolean; message?: string; data: WarehousePage }
    >(BASE, { params: { page, size, sort, search } });

    const maybe = data as { success?: boolean; data?: WarehousePage; message?: string };
    if (typeof maybe?.success === "boolean") {
      if (maybe.success && maybe.data) return maybe.data;
      throw new Error(maybe.message || "No se pudo obtener depósitos");
    }
    return data as WarehousePage;
  },

  async create(payload: Pick<Warehouse, "name" | "location">): Promise<Warehouse> {
    console.log("Creating warehouse with payload:", payload);
    const { data } = await api.post(`${BASE}/create`, payload);
    const maybe = data as { success?: boolean; data?: Warehouse; message?: string };
    if (typeof maybe?.success === "boolean") {
      if (maybe.success && maybe.data) return maybe.data;
      throw new Error(maybe.message || "No se pudo crear el depósito");
    }
    return data as Warehouse;
  },

  async update(
    id: number,
    payload: Partial<Pick<Warehouse, "name" | "location">>,
  ): Promise<Warehouse> {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    const maybe = data as { success?: boolean; data?: Warehouse; message?: string };
    if (typeof maybe?.success === "boolean") {
      if (maybe.success && maybe.data) return maybe.data;
      throw new Error(maybe.message || "No se pudo actualizar el depósito");
    }
    return data as Warehouse;
  },

  async remove(id: number): Promise<void> {
    const { data } = await api.delete(`${BASE}/${id}`);
    const maybe = data as { success?: boolean; message?: string } | undefined;
    if (maybe && typeof maybe.success === "boolean" && !maybe.success) {
      throw new Error(maybe.message || "No se pudo eliminar el depósito");
    }
  },
};

export default inventoryWarehousesService;

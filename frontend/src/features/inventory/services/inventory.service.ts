import api from "@/services/api";
import type { WarehouseItemPage } from "@/features/inventory/types/inventory.types";

const BASE = "/items/warehouses";

export const inventoryService = {
  async list(params?: {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
  }): Promise<WarehouseItemPage> {
    const { page = 0, size = 20, sort, search } = params || {};
    const { data } = await api.get<
      WarehouseItemPage | { success: boolean; message?: string; data: WarehouseItemPage }
    >(BASE, {
      params: { page, size, sort, search },
    });
    // unwrap ApiResult-like shape if needed
    const maybe = data as unknown as {
      success?: boolean;
      message?: string;
      data?: WarehouseItemPage;
    };
    if (typeof maybe?.success === "boolean") {
      if (maybe.success && maybe.data) return maybe.data;
      throw new Error(maybe.message || "No se pudo cargar el inventario");
    }
    return data as WarehouseItemPage;
  },
  async create(payload: {
    name: string;
    description: string;
    stock: number;
    stockMin: number;
    warehouseName: string;
  }) {
    const { data } = await api.post(BASE, payload);
    return data as unknown as { id: number } & typeof payload;
  },
  async update(
    id: number,
    payload: Partial<{
      name: string;
      description: string;
      stock: number;
      stockMin: number;
      warehouseName: string;
    }>,
  ) {
    const { data } = await api.put(`${BASE}/${id}`, payload);
    return data as unknown as { id: number } & typeof payload;
  },
  async remove(id: number) {
    await api.delete(`${BASE}/${id}`);
  },
};

export default inventoryService;

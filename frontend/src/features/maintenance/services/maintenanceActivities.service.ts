import api from "@/services/api";
import { PageResponse } from "../types/maintenance.types";
import { MaintenanceActivityItem } from "../types/maintenanceActivities.types";

const BASE = "/maintenance-activities";

interface ListParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  search?: string;
}

interface ApiResult<T> {
  success: boolean;
  message?: string;
  data: T;
}

function isApiResult<T>(val: unknown): val is ApiResult<T> {
  return !!val && typeof val === "object" && "data" in (val as Record<string, unknown>);
}

function unwrap<T>(resp: T | ApiResult<T>): T {
  return isApiResult<T>(resp) ? resp.data : (resp as T);
}

// Helpers de normalización
function coerceIds(val: unknown): number[] | undefined {
  if (Array.isArray(val)) {
    const arr = val
      .map((v) => (typeof v === "string" ? Number(v) : v))
      .filter((v) => Number.isFinite(v as number)) as number[];
    return arr.length ? arr : [];
  }
  if (typeof val === "number") return [val];
  if (typeof val === "string" && val.trim() !== "") {
    const n = Number(val);
    return Number.isFinite(n) ? [n] : undefined;
  }
  return undefined;
}

function normalizeActivityFromApi(raw: unknown): MaintenanceActivityItem {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const idsSource = obj["inventoryMovementIds"] ?? obj["inventoryMovementId"];
  const ids = coerceIds(idsSource);

  const toNumberMaybe = (v: unknown): number | undefined => {
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    if (typeof v === "string") {
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };

  const item: MaintenanceActivityItem = {
    id: toNumberMaybe(obj.id) ?? 0,
    maintenanceOrder: String(obj.maintenanceOrder ?? ""),
    maintenanceOrderId: toNumberMaybe(obj.maintenanceOrderId) ?? 0,
    activityType: String(obj.activityType ?? ""),
    vesselItemId: toNumberMaybe(obj.vesselItemId) ?? 0,
    vesselItemName:
      typeof obj.vesselItemName === "string" ? (obj.vesselItemName as string) : undefined,
    description: String(obj.description ?? ""),
    inventoryMovementIds: ids,
  };
  return item;
}

// Asegura que el payload tenga el formato correcto para el backend
function normalizeActivityPayload(payload: Partial<MaintenanceActivityItem>) {
  const arr = (payload as Partial<MaintenanceActivityItem>).inventoryMovementIds;

  let inventoryMovementIds: number[] | undefined;
  if (Array.isArray(arr)) {
    const casted = arr
      .map((v) => (typeof v === "string" ? Number(v) : v))
      .filter((v) => Number.isFinite(v as number)) as number[];
    inventoryMovementIds = casted;
  } else if (arr === undefined) {
    inventoryMovementIds = undefined;
  } else {
    inventoryMovementIds = [];
  }

  return {
    ...payload,
    inventoryMovementIds,
  } as Partial<MaintenanceActivityItem>;
}

export const maintenanceActivitiesService = {
  async list(params: ListParams = {}): Promise<PageResponse<MaintenanceActivityItem>> {
    const { page = 0, size = 20, sort, search } = params;
    const { data } = await api.get<
      PageResponse<MaintenanceActivityItem> | ApiResult<PageResponse<MaintenanceActivityItem>>
    >(BASE, {
      params: { page, size, sort, search },
    });
    const pageResp = unwrap<PageResponse<unknown>>(data);
    return {
      ...(pageResp as PageResponse<unknown>),
      content: (pageResp.content as unknown[] | undefined)?.map(normalizeActivityFromApi) ?? [],
    } as PageResponse<MaintenanceActivityItem>;
  },

  // Fetch activities filtered by maintenanceOrderId using the /search endpoint
  async searchByOrder(
    maintenanceOrderId: number,
    params: Omit<ListParams, "search"> = {},
  ): Promise<PageResponse<MaintenanceActivityItem>> {
    const { page = 0, size = 20, sort } = params;
    const { data } = await api.get<
      PageResponse<MaintenanceActivityItem> | ApiResult<PageResponse<MaintenanceActivityItem>>
    >(`${BASE}/search`, {
      params: { maintenanceOrderId, page, size, sort },
    });
    const pageResp = unwrap<PageResponse<unknown>>(data);
    return {
      ...(pageResp as PageResponse<unknown>),
      content: (pageResp.content as unknown[] | undefined)?.map(normalizeActivityFromApi) ?? [],
    } as PageResponse<MaintenanceActivityItem>;
  },

  // Get only the total count of activities for an order (uses size=1 to read totalElements)
  async countByOrder(maintenanceOrderId: number): Promise<number> {
    const { data } = await api.get<
      PageResponse<MaintenanceActivityItem> | ApiResult<PageResponse<MaintenanceActivityItem>>
    >(`${BASE}/search`, {
      params: { maintenanceOrderId, page: 0, size: 1 },
    });
    const page = unwrap<PageResponse<MaintenanceActivityItem>>(data);
    return page?.totalElements ?? page?.content?.length ?? 0;
  },

  async getById(id: number): Promise<MaintenanceActivityItem> {
    const { data } = await api.get<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      `${BASE}/${id}`,
    );
    const raw = unwrap<unknown>(data);
    return normalizeActivityFromApi(raw);
  },

  async create(payload: Partial<MaintenanceActivityItem>): Promise<MaintenanceActivityItem> {
    const body = normalizeActivityPayload(payload);
    console.log("Creating activity with payload:", JSON.stringify(body));
    const { data } = await api.post<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      BASE,
      body,
    );
    const raw = unwrap<unknown>(data);
    return normalizeActivityFromApi(raw);
  },

  async update(
    id: number,
    payload: Partial<MaintenanceActivityItem>,
  ): Promise<MaintenanceActivityItem> {
    const body = normalizeActivityPayload(payload);
    console.log("Updating activity id:", id, "with payload:", JSON.stringify(body));
    const { data } = await api.put<MaintenanceActivityItem | ApiResult<MaintenanceActivityItem>>(
      `${BASE}/${id}`,
      body,
    );
    const raw = unwrap<unknown>(data);
    return normalizeActivityFromApi(raw);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};

export default maintenanceActivitiesService;

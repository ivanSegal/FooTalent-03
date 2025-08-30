import type { MaintenanceListItem, PageResponse } from "@/features/maintenance";

export interface MaintenanceMetrics {
  // Todos los estatus con conteo (ordenados desc)
  statuses: Array<{ status: string; count: number }>;
  // Top 3 estatus (se mantiene para usos futuros)
  topStatuses: Array<{ status: string; count: number }>; // top 3
  lastFinishedActivityByVesselItem: Array<{
    vesselItemId: number;
    vesselItemName?: string;
    maintenanceOrderId: number;
    maintenanceType?: string;
    finishedAt?: string | null;
  }>;
  historicalByType: Array<{ type: string; count: number }>; // Preventivo/Correctivo
  // NUEVO: listado de órdenes abiertas (parcial)
  openOrders: Array<{
    id: number;
    vesselName: string;
    maintenanceType: string;
    status: string;
    issuedAt: string | null;
    scheduledAt: string | null;
    startedAt: string | null;
  }>;
}

export function buildMaintenanceMetrics(
  page: PageResponse<MaintenanceListItem> | null | undefined,
): MaintenanceMetrics {
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const openOrders: MaintenanceMetrics["openOrders"] = [];

  // Estados que consideramos de cierre
  const closedStatuses = new Set(["FINALIZADA", "CANCELADA", "RECHAZADA", "CERRADA", "ANULADA"]);

  for (const it of page?.content ?? []) {
    const status = String(it.status ?? "").toUpperCase();
    const type = String(it.maintenanceType ?? "").toUpperCase();
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    byType[type] = (byType[type] ?? 0) + 1;

    const isClosed = closedStatuses.has(status) || Boolean(it.finishedAt);
    if (!isClosed) {
      openOrders.push({
        id: it.id,
        vesselName: it.vesselName,
        maintenanceType: it.maintenanceType,
        status: it.status,
        issuedAt: it.issuedAt,
        scheduledAt: it.scheduledAt,
        startedAt: it.startedAt,
      });
    }
  }

  const statuses = Object.entries(byStatus)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const topStatuses = statuses.slice(0, 3);

  const historicalByType = Object.entries(byType)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Nota: "última actividad finalizada por ítem de embarcación"
  // Filtrar solo órdenes con estado FINALIZADA y con fecha de finalización
  const lastFinishedActivityByVesselItem: Array<{
    vesselItemId: number;
    vesselItemName?: string;
    maintenanceOrderId: number;
    maintenanceType?: string;
    finishedAt?: string | null;
  }> = [];

  for (const it of page?.content ?? []) {
    const statusUp = String(it.status ?? "")
      .toUpperCase()
      .trim();
    const hasFinished = Boolean(it.finishedAt && String(it.finishedAt).trim());
    if (!(statusUp === "FINALIZADO" && hasFinished)) continue;

    const raw = it as unknown as { vesselItemId?: number; vesselItemName?: string };
    const vesselItemId = Number(raw.vesselItemId ?? it.vesselId ?? it.id);
    const vesselItemName = raw.vesselItemName ?? it.vesselName;

    lastFinishedActivityByVesselItem.push({
      vesselItemId,
      vesselItemName,
      maintenanceOrderId: it.id,
      maintenanceType: it.maintenanceType,
      finishedAt: it.finishedAt,
    });
  }

  // Ordenar por finishedAt desc (si existe)
  lastFinishedActivityByVesselItem.sort((a, b) =>
    String(b.finishedAt).localeCompare(String(a.finishedAt)),
  );

  return { statuses, topStatuses, lastFinishedActivityByVesselItem, historicalByType, openOrders };
}

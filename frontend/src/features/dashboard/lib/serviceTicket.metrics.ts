import type {
  ServiceTicketListItem,
  ServiceTicketPage,
} from "@/features/service-ticket/types/serviceTicket.types";

export interface ServiceTicketMetrics {
  byStatus: Record<string, number>;
  byVessel: Array<{ vesselId: number; vesselName: string; count: number }>;
  openLinkedToVessels: ServiceTicketListItem[]; // abiertas
}

function normalizeStatus(val: unknown): string {
  if (typeof val === "boolean") return val ? "OPEN" : "CLOSED";
  if (typeof val === "string") return val.toUpperCase();
  return "UNKNOWN";
}

export function buildServiceTicketMetrics(
  page: ServiceTicketPage | null | undefined,
): ServiceTicketMetrics {
  const byStatus: Record<string, number> = {};
  // Key by id if present, otherwise by normalized vessel name to avoid empty results
  const vesselMap = new Map<string, { vesselId: number; vesselName: string; count: number }>();
  const open: ServiceTicketListItem[] = [];

  const items = page?.content ?? [];
  for (const it of items) {
    const statusLabel = normalizeStatus((it as unknown as { status?: unknown }).status);
    const vesselId = Number((it as unknown as { vesselId?: number }).vesselId ?? 0);
    const vesselNameRaw = String((it as unknown as { vesselName?: string }).vesselName ?? "");
    const vesselAttendedRaw = String(
      (it as unknown as { vesselAttended?: string }).vesselAttended ?? "",
    );
    const vesselName = (vesselNameRaw || vesselAttendedRaw || "").trim();

    // by status
    byStatus[statusLabel] = (byStatus[statusLabel] ?? 0) + 1;

    // by vessel (fallback to name when id missing)
    const key =
      vesselId > 0 ? `id:${vesselId}` : vesselName ? `name:${vesselName}` : "name:Unknown";
    const curr = vesselMap.get(key) ?? {
      vesselId: vesselId > 0 ? vesselId : 0,
      vesselName: vesselName || (vesselId > 0 ? `Embarcación #${vesselId}` : "Desconocida"),
      count: 0,
    };
    curr.count += 1;
    // prefer non-empty vesselName when updating
    if (vesselName && !curr.vesselName) curr.vesselName = vesselName;
    vesselMap.set(key, curr);

    // open tickets only (heurística): boolean true o etiquetas comunes
    if (
      statusLabel === "OPEN" ||
      statusLabel === "ABIERTA" ||
      statusLabel === "PENDIENTE" ||
      statusLabel === "EN_PROCESO" ||
      statusLabel === "TRUE"
    ) {
      open.push(it);
    }
  }

  const byVessel = Array.from(vesselMap.values()).sort((a, b) => b.count - a.count);

  return { byStatus, byVessel, openLinkedToVessels: open };
}

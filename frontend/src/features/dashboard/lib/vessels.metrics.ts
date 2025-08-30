import type { VesselPage } from "@/features/vessels/types/vessel.types";
import type { VesselItemHoursPage } from "@/features/vessels/types/vesselItemHours.types";
import type { VesselItemPage, VesselItem } from "@/features/vessels/types/vesselItem.types";

export interface VesselMetrics {
  dailyHoursByVessel: Array<{ vesselId: number; date: string; hours: number }>;
  itemsNearAlert: Array<{
    vesselId: number;
    vesselItemId: number;
    name?: string;
    accumulatedHours?: number;
    alertHours?: number;
  }>;
  navigationSummary: Array<{ vesselId: number; vesselName: string; navigationHours: number }>;
}

export function buildVesselMetrics(
  vessels: VesselPage | null | undefined,
  hoursPage: VesselItemHoursPage | null | undefined,
  itemsPage?: VesselItemPage | null | undefined,
): VesselMetrics {
  // Daily hours: sum addedHours per vessel/date
  const dailyMap = new Map<string, { vesselId: number; date: string; hours: number }>();
  for (const e of hoursPage?.content ?? []) {
    const key = `${e.vesselId}|${e.date}`;
    const sum = Array.isArray(e.items)
      ? e.items.reduce(
          (acc, it) => acc + Number((it as { addedHours?: number }).addedHours ?? 0),
          0,
        )
      : 0;
    const curr = dailyMap.get(key) ?? {
      vesselId: Number(e.vesselId),
      date: String(e.date),
      hours: 0,
    };
    curr.hours += sum;
    dailyMap.set(key, curr);
  }
  const dailyHoursByVessel = Array.from(dailyMap.values()).sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );

  // Items near alert — use itemsPage if provided
  const itemsNearAlert: Array<{
    vesselId: number;
    vesselItemId: number;
    name?: string;
    accumulatedHours?: number;
    alertHours?: number;
  }> = [];

  const items: VesselItem[] = itemsPage?.content ?? [];
  for (const it of items) {
    const acc = Number(it.accumulatedHours ?? 0);
    const alert = Number(it.alertHours ?? 0);
    if (!alert) continue;
    const ratio = acc / alert;
    if (ratio >= 0.8) {
      itemsNearAlert.push({
        vesselId: Number((it as unknown as { vesselId?: number }).vesselId ?? 0),
        vesselItemId: it.id,
        name: it.name,
        accumulatedHours: acc,
        alertHours: alert,
      });
    }
  }

  // Navigation summary from vessels
  const navigationSummary = (vessels?.content ?? [])
    .map((v) => ({
      vesselId: Number((v as unknown as { id?: number }).id ?? 0),
      vesselName: String((v as unknown as { name?: string }).name ?? ""),
      navigationHours: Number((v as unknown as { navigationHours?: number }).navigationHours ?? 0),
    }))
    .sort((a, b) => b.navigationHours - a.navigationHours);

  return { dailyHoursByVessel, itemsNearAlert, navigationSummary };
}

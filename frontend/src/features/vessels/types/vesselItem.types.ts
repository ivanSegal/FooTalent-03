import type { PageResponse } from "@/features/maintenance";

export interface VesselItem {
  id: number;
  name: string;
  description: string;
  controlType: string;
  accumulatedHours: number;
  usefulLifeHours: number;
  alertHours: number;
  materialType: string;
}

export type VesselItemPage = PageResponse<VesselItem>;

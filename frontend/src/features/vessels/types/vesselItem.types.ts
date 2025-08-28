import type { PageResponse } from "@/features/maintenance";

export type ControlType =
  | "NAVIGATION"
  | "COMMUNICATION"
  | "SAFETY"
  | "ENGINE"
  | "ELECTRICAL"
  | "OTHER";

export type MaterialType = "COMPONENTS" | "CONSUMABLES" | "SPARE_PARTS" | "TOOLS" | "OTHER";

export interface VesselItem {
  id: number;
  name: string;
  description: string;
  controlType: ControlType;
  accumulatedHours: number;
  usefulLifeHours: number;
  alertHours: number;
  materialType: MaterialType;
}

export type VesselItemPage = PageResponse<VesselItem>;

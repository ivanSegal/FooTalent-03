import type { PageResponse } from "@/features/maintenance";

// Modelo de embarcación (vessel) según respuesta del backend
export interface Vessel {
  id: number;
  name: string;
  registrationNumber: string;
  ismm: string;
  flagState: string;
  callSign: string;
  portOfRegistry: string;
  rif: string;
  serviceType: string;
  constructionMaterial: string;
  sternType: string;
  fuelType: string;
  navigationHours: number;
}

export type VesselPage = PageResponse<Vessel>;

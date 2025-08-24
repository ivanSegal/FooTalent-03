import type { PageResponse } from "@/features/maintenance";

// Modelo de embarcación (vassel) según respuesta del backend
export interface Vassel {
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

export type VasselPage = PageResponse<Vassel>;

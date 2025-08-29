import type { PageResponse } from "@/features/maintenance";

// Tipos para la respuesta paginada de boleta de servicio
export interface ServiceTicketListItem {
  id: number;
  travelNro: number;
  travelDate: string; // "DD-MM-YYYY"
  vesselAttended: string;
  solicitedBy: string;
  reportTravelNro: string;
  // code: string;
  // checkingNro: number;
  vesselName: string;
  vesselId: number;
  responsibleUsername: string;
  status: boolean;
}

export type ServiceTicketPage = PageResponse<ServiceTicketListItem>;

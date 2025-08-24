import type { PageResponse } from "@/features/maintenance";

// Tipos para la respuesta paginada de boleta de servicio
export interface ServiceTicketListItem {
  id: number;
  travelNro: number;
  travelDate: string; // "DD-MM-YYYY"
  vesselAttended: string;
  solicitedBy: string;
  reportTravelNro: string;
  code: string;
  checkingNro: number;
  boatName: string;
  boatId: number;
  responsibleUsername: string;
}

export type ServiceTicketPage = PageResponse<ServiceTicketListItem>;

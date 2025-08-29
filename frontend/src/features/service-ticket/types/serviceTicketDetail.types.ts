export interface ServiceTicketDetail {
  id: number;
  serviceTicketId: number;
  serviceArea: string;
  serviceType: string;
  description: string;
  hoursTraveled?: string; // HH:mm (solo lectura, puede venir del backend)
  patronFullName: string;
  marinerFullName: string;
  captainFullName: string;
}

export type CreateServiceTicketDetailPayload = Omit<ServiceTicketDetail, "id" | "hoursTraveled">;
export type UpdateServiceTicketDetailPayload = Partial<CreateServiceTicketDetailPayload>;

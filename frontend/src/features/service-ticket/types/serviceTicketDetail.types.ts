export interface ServiceTicketDetail {
  id: number;
  serviceTicketId: number;
  serviceArea: string;
  serviceType: string;
  description: string;
  hoursTraveled: string; // HH:mm
  patronFullName: string;
  marinerFullName: string;
  captainFullName: string;
}

export type CreateServiceTicketDetailPayload = Omit<ServiceTicketDetail, "id">;
export type UpdateServiceTicketDetailPayload = Partial<CreateServiceTicketDetailPayload>;

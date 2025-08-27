export interface ServiceTicketTravel {
  id: number;
  origin: string;
  destination: string;
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  totalTraveledTime?: string; // HH:mm (calculado por backend)
  serviceTicketDetailId: number;
}

export type CreateServiceTicketTravelPayload = Omit<
  ServiceTicketTravel,
  "id" | "totalTraveledTime"
>;
export type UpdateServiceTicketTravelPayload = Partial<CreateServiceTicketTravelPayload>;

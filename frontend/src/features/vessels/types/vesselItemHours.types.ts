export interface VesselItemHoursRow {
  vesselItemId: number;
  addedHours: number; // puede ser decimal
}

export interface VesselItemHoursRequest {
  vesselId: number;
  date: string; // DD-MM-YYYY
  description: string;
  items: VesselItemHoursRow[];
}

export interface VesselItemHoursResponse {
  success?: boolean;
  message?: string;
}

// Historial de reportes de horas
export interface VesselItemHoursEntry {
  id: number;
  vesselId: number;
  date: string; // YYYY-MM-DD (formato que devuelve el backend en GET)
  description?: string;
  responsable?: string;
  items?: VesselItemHoursRow[]; // Detalle opcional según API
  createdBy?: string;
  createdAt?: string; // ISO
}

export interface VesselItemHoursPage {
  content: VesselItemHoursEntry[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual
}

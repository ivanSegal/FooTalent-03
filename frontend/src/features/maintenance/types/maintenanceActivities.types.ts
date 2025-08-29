// Tipos para Actividades de Mantenimiento

export interface MaintenanceActivityItem {
  id: number;
  maintenanceOrder: string; // "2-Titanic II-PREVENTIVO"
  maintenanceOrderId: number;
  activityType: string; // Ej. "INSPECCION" (en tu ejemplo viene con typo "INSEPCCION")
  vesselItemId: number;
  vesselItemName?: string; // opcional, para mostrar
  description: string;
  inventoryMovementIds?: number[]; // canónica en frontend
  inventoryMovementsIds?: number[]; // alias que puede venir del backend (GET)
}

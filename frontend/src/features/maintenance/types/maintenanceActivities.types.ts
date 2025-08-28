// Tipos para Actividades de Mantenimiento

export interface MaintenanceActivityItem {
  id: number;
  maintenanceOrder: string; // "2-Titanic II-PREVENTIVO"
  activityType: string; // Ej. "INSPECCION" (en tu ejemplo viene con typo "INSEPCCION")
  vesselItemName: string; // Ej. "Motor de propulsión principal"
  description: string;
  inventoryMovementId: number | null;
}

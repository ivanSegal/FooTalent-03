export interface MantenimientoItem {
  id: number;
  embarcacion: string;
  tarea: string;
  responsable?: string;
  fechaProgramada?: string; // ISO date
  fechaReal?: string; // ISO date
  estado?: "pendiente" | "en_progreso" | "completado";
  costo?: number;
}

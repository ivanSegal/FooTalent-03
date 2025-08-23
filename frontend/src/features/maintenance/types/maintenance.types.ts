// Tipos para la respuesta paginada del listado de órdenes de mantenimiento

export interface MaintenanceListItem {
  id: number;
  vesselName: string;
  maintenanceType: string; // p.ej. "PREVENTIVO"
  status: string; // p.ej. "SOLICITADO"
  maintenanceManager: string;
  maintenanceReason: string | null;
  issuedAt: string | null; // formato "dd-MM-yyyy"
  scheduledAt: string | null; // formato "dd-MM-yyyy" o null
  startedAt: string | null; // formato "dd-MM-yyyy" o null
  finishedAt: string | null; // formato "dd-MM-yyyy" o null
}

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageableInfo;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Paginacion<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  totalElements: number;
}

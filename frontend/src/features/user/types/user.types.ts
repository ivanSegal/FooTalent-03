export type UserRole = "ADMIN" | "SUPERVISOR" | "OPERATOR";
export type UserDepartment = "INVENTORY" | "MAINTENANCE" | "VESSEL" | null;
export type AccountStatus = "ACTIVE" | "INACTIVE";

export interface UserListItem {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  accountStatus: AccountStatus;
}

export interface SortInfo {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageableInfo;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface User {
  uuid?: string;
  id: string;   
  username: string;
  firstName: string; 
  lastName: string;  
  email: string;
  role: string;
  department?: string;
  accountStatus: string;
  password?: string;
}


export interface PaginatedResponse {
  content: User[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort?: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department: string;
  accountStatus?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  accountStatus: string;
}


export interface UserFilters {
  search?: string;
  role?: string;
  department?: string;
  accountStatus?: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface UserTableProps {
  users: User[];
  loading: boolean;
  onView: (userId: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export interface UsersFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  loading?: boolean;
}

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  authToken?: string; 
}
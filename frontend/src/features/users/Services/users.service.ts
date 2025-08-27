
import api from "@/services/api";
import Cookies from "js-cookie";
import { 
  User, 
  PaginatedResponse, 
  ApiResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserFilters,
  PaginationParams 
} from "../Types/user.types";

export class UsersService {
  private static instance: UsersService;
  
  private constructor() {}
  
  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  /*Obtener el token de autenticación */
  private getAuthToken(propAuthToken?: string): string | null {
    if (propAuthToken && propAuthToken.trim() !== "" && propAuthToken !== "YOUR_AUTH_TOKEN_HERE") {
      return propAuthToken;
    }

    if (typeof window !== "undefined") {
      const cookieToken = Cookies.get("token");
      if (cookieToken && cookieToken.trim() !== "") {
        return cookieToken;
      }

      const localStorageToken = localStorage.getItem("token");
      if (localStorageToken && localStorageToken.trim() !== "") {
        return localStorageToken;
      }
    }

    return null;
  }

  /*Verifica si hay un token válido*/
  public hasValidToken(authToken?: string): boolean {
    return this.getAuthToken(authToken) !== null;
  }
  private buildQueryParams(
    pagination: PaginationParams,
    filters?: UserFilters
  ): URLSearchParams {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      size: pagination.size.toString(),
    });

    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    if (filters?.role) {
      params.append("role", filters.role);
    }

    if (filters?.accountStatus) {
      params.append("accountStatus", filters.accountStatus);
    }

    if (filters?.department) {
      params.append("department", filters.department);
    }

    return params;
  }

  /*Filtrar usuarios localmente*/
  public filterUsersLocally(usersList: User[], searchTerm: string): User[] {
    if (!searchTerm.trim()) return usersList;

    const term = searchTerm.toLowerCase().trim();

    return usersList.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const fullName = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const role = user.role?.toLowerCase().replace("_", " ") || "";

      return (
        username.includes(term) ||
        fullName.includes(term) ||
        email.includes(term) ||
        role.includes(term)
      );
    });
  }

  /*Obtener usuarios con paginación y filtros*/
  public async fetchUsers(
    pagination: PaginationParams,
    filters?: UserFilters,
    authToken?: string
  ): Promise<{ users: User[]; totalPages: number; totalElements: number; currentPage: number }> {
    if (!this.hasValidToken(authToken)) {
      throw new Error("⚠️ Token de autenticación requerido para cargar usuarios.");
    }

    try {
      const params = this.buildQueryParams(pagination, filters);
      const response = await api.get<ApiResponse<PaginatedResponse>>(`/users?${params}`);
      const data = response.data.data;

      const fetchedUsers = data.content || [];

      return {
        users: fetchedUsers,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        currentPage: data.number || 0,
      };
    } catch (err: any) {
      console.error("Error fetching users:", err);
      throw new Error(err.message || "Error desconocido al cargar usuarios.");
    }
  }

  /*Obtener todos los usuarios para filtrado local*/
  public async fetchAllUsers(authToken?: string): Promise<User[]> {
    if (!this.hasValidToken(authToken)) {
      throw new Error("⚠️ Token de autenticación requerido para cargar usuarios.");
    }

    try {
      const response = await api.get<ApiResponse<PaginatedResponse>>("/users?size=1000");
      const data = response.data.data;
      return data.content || [];
    } catch (err: any) {
      console.error("Error fetching all users:", err);
      throw new Error(err.message || "Error desconocido al cargar usuarios.");
    }
  }

  /*Obtener un usuario por ID*/
  public async fetchUserById(userId: string, authToken?: string): Promise<User> {
    if (!this.hasValidToken(authToken)) {
      throw new Error("Se requiere autenticación válida");
    }

    try {
      const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching user by ID:", err);
      throw new Error(err.message || "Error al obtener el usuario");
    }
  }

  /*Crear un nuevo usuario*/
  public async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>("/users", userData);
      return response.data.data;
    } catch (err: any) {
      console.error("Error creating user:", err);
      throw new Error(err.message || "Error al crear el usuario");
    }
  }

  /*Actualizar un usuario existente*/
  public async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${userId}`, userData);
      return response.data.data;
    } catch (err: any) {
      console.error("Error updating user:", err);
      throw new Error(err.message || "Error al actualizar el usuario");
    }
  }

  /*Elimina un usuario*/
  public async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      throw new Error(err.message || "Error al eliminar el usuario");
    }
  }

  /*Genera URL de avatar*/
  public generateAvatarUrl(user: User): string {
    const name = user.fullName || user.username;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=496490&color=fff&size=40&rounded=true&bold=true`;
  }

  public formatDate(dateString?: string): string {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  }

  public formatTime(dateString?: string): string {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }
}

export const usersService = UsersService.getInstance();
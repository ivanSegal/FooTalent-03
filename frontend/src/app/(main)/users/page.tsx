"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import Cookies from "js-cookie";
import Sidebar from "../sidebar/sidebar";
import { DeleteUserModal } from "./../modal/modalDelete";
import { CreateUserModal } from "../modal/modalUsers";
import {
  PlusOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";


interface User {
  uuid: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  accountStatus: string;
  password?: string;
  createdAt?: string;
}

interface PaginatedResponse {
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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
  createdAt?: string;
}

interface Props {
  authToken?: string;
}

const UsersManagement: React.FC<Props> = ({ authToken: propAuthToken }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Estado para filtros locales (cuando la API no soporte filtros múltiples)
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Función para obtener el token desde múltiples fuentes
  const getAuthToken = (): string | null => {
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
  };

  const authToken = getAuthToken();
  const hasValidToken = authToken !== null;

  // Función para filtrar usuarios localmente
  const filterUsersLocally = (usersList: User[], searchTerm: string): User[] => {
    if (!searchTerm.trim()) return usersList;

    const term = searchTerm.toLowerCase().trim();

    return usersList.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const fullName = user.fullName?.toLowerCase() || "";
      const role = user.role?.toLowerCase().replace("_", " ") || "";

      return username.includes(term) || fullName.includes(term) || role.includes(term);
    });
  };

  // Fetch all users with pagination - MODIFICADO
  const fetchUsers = async (page: number = 0, search: string = "") => {
    if (!hasValidToken) {
      setError("⚠️ Token de autenticación requerido para cargar usuarios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Opción 1: Si tu API soporta búsqueda en múltiples campos
      // Puedes intentar pasar parámetros como fullName, role, etc.
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        // Si tu API soporta estos parámetros, descomenta las siguientes líneas:
        // ...(search && { username: search.trim() }),
        // ...(search && { fullName: search.trim() }),
        // ...(search && { role: search.trim() })
      });

      // Opción 2: Si solo soporta un parámetro de búsqueda general
      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      const response = await api.get<ApiResponse<PaginatedResponse>>(`/users?${params}`);
      const data = response.data.data;

      const fetchedUsers = data.content || [];

      // Si no hay término de búsqueda, usamos los datos directamente
      if (!search || !search.trim()) {
        setUsers(fetchedUsers);
        setAllUsers(fetchedUsers);
      } else {
        // Si hay búsqueda, aplicamos filtro local para mayor precisión
        const filteredUsers = filterUsersLocally(fetchedUsers, search);
        setUsers(filteredUsers);
        setAllUsers(fetchedUsers);
      }

      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(data.number || 0);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error desconocido al cargar usuarios.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Función alternativa: Cargar todos los usuarios y filtrar localmente
  const fetchAllUsersAndFilter = async (search: string = "") => {
    if (!hasValidToken) {
      setError("⚠️ Token de autenticación requerido para cargar usuarios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cargar todos los usuarios sin filtros
      const response = await api.get<ApiResponse<PaginatedResponse>>("/users?size=1000"); // Ajusta el tamaño según tu necesidad
      const data = response.data.data;
      const allUsersList = data.content || [];

      setAllUsers(allUsersList);

      // Aplicar filtros localmente
      const filteredUsers = filterUsersLocally(allUsersList, search);

      // Simular paginación local
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      setUsers(paginatedUsers);
      setTotalPages(Math.ceil(filteredUsers.length / pageSize));
      setTotalElements(filteredUsers.length);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error desconocido al cargar usuarios.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single user by ID
  const fetchUserById = async (userId: string): Promise<User | null> => {
    if (!hasValidToken) {
      throw new Error("Se requiere autenticación válida");
    }

    try {
      const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching user by ID:", err);
      throw new Error(err.message || "Error al obtener el usuario");
    }
  };

  // Create new user
  const createUser = async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>("/users", userData);
      return response.data.data;
    } catch (err: any) {
      console.error("Error creating user:", err);
      throw new Error(err.message || "Error al crear el usuario");
    }
  };

  // Update user
  const updateUser = async (
    userId: string,
    userData: Partial<CreateUserRequest>,
  ): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${userId}`, userData);
      return response.data.data;
    } catch (err: any) {
      console.error("Error updating user:", err);
      throw new Error(err.message || "Error al actualizar el usuario");
    }
  };

  // Delete user
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      throw new Error(err.message || "Error al eliminar el usuario");
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (hasValidToken) {
      // OPCIÓN A: Usar API con filtros (actual)
      fetchUsers(0);

      // OPCIÓN B: Cargar todos y filtrar localmente (descomenta si prefieres esta opción)
      // fetchAllUsersAndFilter('');
    } else {
      setError("⚠️ No se encontró token de autenticación. Asegúrate de estar logueado.");
      setLoading(false);
    }
  }, [hasValidToken]);

  // Handle search with debounce - MODIFICADO
  useEffect(() => {
    if (!hasValidToken) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(0);

      // OPCIÓN A: Usar API con filtros
      fetchUsers(0, searchTerm);

      // OPCIÓN B: Filtrar localmente (descomenta si prefieres esta opción)
      // fetchAllUsersAndFilter(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, hasValidToken]);

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
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
  };

  // Helper function to generate avatar URL with better styling
  const getAvatarUrl = (user: User): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=496490&color=fff&size=40&rounded=true&bold=true`;
  };

  const handleView = async (userId: string) => {
    try {
      const userData = await fetchUserById(userId);
      if (userData) {
        alert(
          `Detalles del usuario:\n\nID: ${userData.uuid}\nUsuario: ${userData.username}\nNombre completo: ${userData.fullName || "N/A"}\nRol: ${userData.role}`,
        );
      }
    } catch (err: any) {
      alert(`Error al obtener los detalles del usuario: ${err.message}`);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };
  const handleCreateUser = async (userData: {
  fullName: string;
  email: string;
  username: string;
  role: string;
  password: string;
}) => {
  try {
    await createUser(userData); 
    fetchUsers(currentPage, searchTerm); 
  } catch (err: any) {
    alert(`Error al crear usuario: ${err.message}`);
  }
};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // OPCIÓN A: Usar API con paginación
    fetchUsers(page, searchTerm);

    // OPCIÓN B: Paginación local (descomenta si usas filtros locales)
    // const filteredUsers = filterUsersLocally(allUsers, searchTerm);
    // const startIndex = page * pageSize;
    // const endIndex = startIndex + pageSize;
    // const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    // setUsers(paginatedUsers);
    // setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchUsers(currentPage, searchTerm);
  };

  console.log("Users data:", users);
  console.log("First user:", users[0]);

  return (
    <>
        <Sidebar />
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="mx-auto max-w-7xl">
        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Toolbar within table */}
          <div className="border-b border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Header */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de usuarios</h1>
                {loading && <LoadingOutlined className="text-blue-500" spin />}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <ExclamationCircleOutlined className="mt-0.5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-red-600">
                      {error.includes("autenticación") || error.includes("token")
                        ? "Problema de Autenticación"
                        : "Error al cargar datos"}
                    </p>
                    <p className="mt-1 text-sm text-red-600">{error}</p>

                    {error.includes("token") ? (
                      <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                        <p className="font-medium text-blue-800">💡 Posibles soluciones:</p>
                        <p className="mt-1 text-blue-700">1. Inicia sesión nuevamente</p>
                        <p className="mt-1 text-blue-700">
                          2. Verifica que el token esté guardado en cookies o localStorage
                        </p>
                        <p className="mt-1 text-blue-700">
                          3. O pasa el token como prop:{" "}
                          <code className="rounded bg-blue-100 px-1">
                            {'<UsersManagement authToken="tu_token" />'}
                          </code>
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleRefresh}
                        className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                      >
                        Reintentar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Search Bar - MEJORADO */}
              <div className="relative max-w-md flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchOutlined className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, usuario o rol"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!hasValidToken}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {/* Add User Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-lg px-4 py-2 font-medium text-white"
                  style={{ backgroundColor: "#496490", color: "white" }}
                >
                  <PlusOutlined className="h-4 w-4" />
                  Agregar nuevo usuario
                </button>
                {/* Filters Button */}
                <button
                  disabled={!hasValidToken}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: "#496490", color: "white" }}
                >
                  <FilterOutlined className="h-4 w-4" />
                  Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-4 gap-4 px-6 py-4">
              <div className="text-sm font-medium text-gray-700">Usuario</div>
              <div className="text-sm font-medium text-gray-700">Rol</div>
              <div className="text-sm font-medium text-gray-700">Fecha de creación</div>
              <div className="text-sm font-medium text-gray-700">Acciones</div>
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="px-6 py-12 text-center">
              <LoadingOutlined className="mb-4 text-2xl text-blue-500" spin />
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                {searchTerm
                  ? `No se encontraron usuarios que coincidan con "${searchTerm}"`
                  : "No hay usuarios disponibles"}
              </p>
              {!hasValidToken && (
                <p className="mt-2 text-sm text-red-500">
                  Token de autenticación requerido para mostrar datos
                </p>
              )}
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-400">
                  La búsqueda incluye nombre completo, usuario y rol
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div
                  key={user.uuid}
                  className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  {/* User with Avatar and Name - IMPROVED SECTION */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={getAvatarUrl(user)}
                        alt={`Avatar de ${user.username}`}
                        className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                        onError={(e) => {
                          // Fallback en caso de error en la imagen
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username.charAt(0))}&background=6b7280&color=fff&size=40`;
                        }}
                      />
                      {/* Status indicator (optional - can show online/offline status) */}
                      <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.fullName ? user.fullName : user.username}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "border border-red-200 bg-red-100 text-red-800"
                          : user.role === "WAREHOUSE_STAFF"
                            ? "border border-blue-200 bg-blue-100 text-blue-800"
                            : user.role === "OPERATIONS_MANAGER"
                              ? "border border-green-200 bg-green-100 text-green-800"
                              : "border border-gray-200 bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">
                      <div>{formatDate(user.createdAt)}</div>
                      {user.createdAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(user.uuid)}
                      className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Ver detalles del usuario"
                    >
                      <EyeOutlined className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(user)}
                      className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                      title="Editar usuario"
                    >
                      <EditOutlined className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                      className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Eliminar usuario"
                    >
                      <DeleteOutlined className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {users.length} de {totalElements} usuarios
              {searchTerm && ` (filtrados por: "${searchTerm}")`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = currentPage <= 2 ? i : currentPage - 2 + i;
                  if (pageNumber >= totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        pageNumber === currentPage
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && users.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Página {currentPage + 1} de {totalPages} • Total: {totalElements} usuarios
          </div>
        )}
      </div>

      {/* Create User Modal Placeholder */}
      <CreateUserModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onCreateUser={handleCreateUser}
/>


      {/* Edit User Modal Placeholder */}
      {showEditModal && editingUser && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Editar Usuario</h2>
            <p className="mb-4 text-gray-600">Editando: {editingUser.username}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="rounded-lg px-4 py-2 text-white"
                style={{ backgroundColor: "#496490" }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && deletingUser && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingUser(null);
          }}
          user={deletingUser}
          onDeleteUser={async (userId: string) => {
            try {
              await deleteUser(userId);
              fetchUsers(currentPage, searchTerm); // refrescar lista
            } catch (err: any) {
              alert(`Error al eliminar usuario: ${err.message}`);
            }
          }}
        />
      )}
    </div>
    </>
  );
};

export default UsersManagement;

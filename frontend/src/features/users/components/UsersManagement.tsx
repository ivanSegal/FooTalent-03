"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./../../../app/(main)/sidebar/sidebar";
import { DeleteUserModal } from "./Modals/modalDelete";
import { UserDetailsModal } from "./Modals/modalUsersDetails";
import { UsersForm } from "./UsersForm";
import { UsersList } from "./UsersList";
import { usersService } from "./../Services/users.service";
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from "./../Types/user.types";
import {
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { UsersFiltersModal } from "./Modals/modalFilters";

interface Props {
  authToken?: string;
}

const UsersManagement: React.FC<Props> = ({ authToken: propAuthToken }) => {
  // Estados principales
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  // Estados de filtros
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{ role?: string; department?: string; status?: string }>(
    {},
  );

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // NUEVO: Estados para el modal de detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Verificar token válido
  const hasValidToken = usersService.hasValidToken(propAuthToken);

  // Cargar usuarios
  const fetchUsers = async (page: number = 0, filters: UserFilters = {}) => {
    if (!hasValidToken) {
      setError("⚠️ Token de autenticación requerido para cargar usuarios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await usersService.fetchUsers(
        { page, size: pageSize },
        {}, // 👈 no mandamos search al backend
        propAuthToken,
      );

      // Aplicar búsqueda local
      const filtered = usersService.filterUsersLocally(result.users, {
        ...filters,
        search: searchTerm,
      });

      setUsers(filtered);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setCurrentPage(result.currentPage);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (hasValidToken) {
      fetchUsers(0);
    } else {
      setError("⚠️ No se encontró token de autenticación. Asegúrate de estar logueado.");
      setLoading(false);
    }
  }, [hasValidToken]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    if (!hasValidToken) return;

    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers(0, { search: searchTerm });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, hasValidToken]);

  // MODIFICADO: Nuevo handler para ver detalles con modal
  const handleView = (userId: string) => {
    setSelectedUserId(userId);
    setShowDetailsModal(true);
  };

  // NUEVO: Handler para cerrar el modal de detalles
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUserId(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await usersService.createUser(userData);
      fetchUsers(currentPage, { search: searchTerm });
      setShowCreateModal(false);
    } catch (err: any) {
      throw new Error(err.message || "Error al crear usuario");
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserRequest) => {
    try {
      if (!userId) throw new Error("ID de usuario requerido");
      console.log("Actualizando usuario:", userId, userData);
      await usersService.updateUser(userId, userData);
      fetchUsers(currentPage, { search: searchTerm });
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error("Error en handleUpdateUser:", err);
      throw new Error(err.message || "Error al actualizar usuario");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersService.deleteUser(userId, propAuthToken);
      fetchUsers(currentPage, { search: searchTerm });
      setShowDeleteModal(false);
      setDeletingUser(null);
    } catch (err: any) {
      alert(`Error al eliminar usuario: ${err.message}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, { search: searchTerm });
  };

  const handleRefresh = () => {
    fetchUsers(currentPage, { search: searchTerm });
  };

  return (
    <>
      <Sidebar />
      <div className="ml-16 min-h-screen p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-7xl">
          {/* Main Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold text-gray-900">Gestión de usuarios</h1>
                  {loading && <LoadingOutlined className="text-blue-500" spin />}
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchOutlined className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, usuario, email o rol"
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

                {/* Action Buttons */}
                <div className="flex gap-3 text-white">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    disabled={!hasValidToken}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: "#496490" }}
                  >
                    <PlusOutlined className="h-4 w-4" />
                    Agregar nuevo usuario
                  </button>

                  <button
                    disabled={!hasValidToken}
                    onClick={() => setIsFiltersOpen(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: "#496490" }}
                  >
                    <FilterOutlined className="h-4 w-4" />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
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
            </div>

            {/* Table Header */}
            <div className="border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 px-6 py-4">
                <div className="text-sm font-medium text-gray-700">Usuario</div>
                <div className="text-sm font-medium text-gray-700">Rol</div>
                <div className="text-sm font-medium text-gray-700">Acciones</div>
              </div>
            </div>

            {/* Users List Component */}
            <UsersList
              users={users}
              loading={loading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchTerm={searchTerm}
              hasValidToken={hasValidToken}
            />
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

          {/* Footer */}
          {!loading && users.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Página {currentPage + 1} de {totalPages} • Total: {totalElements} usuarios
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <UsersForm
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateUser}
            loading={loading}
          />
        )}

        {/* CORRECCIÓN: Modal para editar usuario */}
        {showEditModal && editingUser && (
          <UsersForm
            user={editingUser}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingUser(null);
            }}
            onEdit={handleUpdateUser}
            loading={loading}
          />
        )}

        {/* Modal para eliminar usuario */}
        {showDeleteModal && deletingUser && (
          <DeleteUserModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeletingUser(null);
            }}
            user={deletingUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {/* Modal para ver detalles del usuario */}
        <UserDetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          userId={selectedUserId}
          authToken={propAuthToken}
        />
      </div>
      {/* Modal para filtros del usuario */}
      <UsersFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(appliedFilters) => {
          setFilters(appliedFilters); // guardar filtros
          setCurrentPage(0);
          fetchUsers(0, { search: searchTerm, ...appliedFilters }); // combinar búsqueda + filtros
        }}
      />
    </>
  );
};

export default UsersManagement;

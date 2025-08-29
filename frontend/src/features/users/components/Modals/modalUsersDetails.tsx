import React, { useState, useEffect } from "react";
import { User, UserDetailsModalProps } from "./../../Types/user.types";
import { usersService } from "./../../Services/users.service";

interface ExtendedUserDetailsModalProps extends UserDetailsModalProps {
  authToken?: string;
}

export const UserDetailsModal: React.FC<ExtendedUserDetailsModalProps> = ({
  isOpen,
  onClose,
  userId,
  authToken,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuario al abrir modal
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);

      try {
        const data = await usersService.fetchUserById(userId, authToken);
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUser();
    } else {
      setUser(null);
      setError(null);
    }
  }, [isOpen, userId, authToken]);

  const getAvatarUrl = (user: User): string => {
    const displayName =
      (user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : "") ||
      user.username ||
      `Usuario ${user.id || user.uuid}`;

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=496490&color=fff&size=80&rounded=true&bold=true`;
  };

  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      ADMIN: "Administrador",
      SUPERVISOR: "Encargado",
      OPERATOR: "Personal",
    };
    return roles[role] || role;
  };

  const getStatusLabel = (status: string): string => {
    return status === "ACTIVE" ? "Activo" : "Inactivo";
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalles del usuario
            </h2>
            {loading && (
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">
                Cargando datos del usuario...
              </span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Datos */}
          {user && !loading && !error && (
            <>
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={getAvatarUrl(user)}
                  alt={`Avatar de ${user.firstName} ${user.lastName}`}
                  className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {user.username
                      ? `@${user.username}`
                      : `ID: ${user.id || user.uuid}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Correo electrónico
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.email || "No especificado"}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Rol
                  </label>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : user.role === "SUPERVISOR"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "OPERATOR"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>

                {user.department && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Departamento
                    </label>
                    <p className="text-sm text-gray-900">{user.department}</p>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Estado de la cuenta
                  </label>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      user.accountStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getStatusLabel(user.accountStatus)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="rounded-b-lg bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#496490", color: "white" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

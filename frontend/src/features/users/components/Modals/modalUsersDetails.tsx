import React, { useState, useEffect } from "react";
import { User, ApiResponse, UserDetailsModalProps } from "./../../Types/user.types";

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

  // Función para obtener los datos del usuario
  const fetchUserDetails = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Intentar primero con la ruta estándar
      let response = await fetch(`https://foottalent-03.onrender.com/api/users/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      // Si falla, intentar con la ruta alternativa documentada
      if (!response.ok && response.status === 404) {
        response = await fetch(`https://foottalent-03.onrender.com/api/users/getUserById/${id}`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
        });
      }

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        // Manejar errores específicos según la documentación
        switch (response.status) {
          case 401:
            errorMessage = "No autorizado. Token de acceso inválido o expirado.";
            break;
          case 403:
            errorMessage = "Acceso denegado. No tienes permisos para ver este usuario.";
            break;
          case 404:
            errorMessage = "Usuario no encontrado.";
            break;
          case 500:
            errorMessage = "Error interno del servidor. Intenta más tarde.";
            break;
          default:
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch {}
        }

        throw new Error(errorMessage);
      }

      const result: ApiResponse<User> = await response.json();

      console.log("Response from API:", result); // Log para depuración

      if (result.success && result.data) {
        setUser(result.data);
      } else {
        throw new Error(result.message || "Error al obtener los datos del usuario");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido al conectar con el servidor",
      );
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails(userId);
    } else if (!isOpen) {
      // Limpiar estado cuando se cierra el modal
      setUser(null);
      setError(null);
    }
  }, [isOpen, userId]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      ADMIN: "Administrador",
      SUPERVISOR: "Encargado",
      OPERATOR: "Personal",
    };
    return roles[role] || role;
  };

  const getAvatarUrl = (user: User): string => {
    // Priorizar fullName, luego username, luego usar el ID como fallback
    const displayName = user.fullName || user.username || `Usuario ${user.id || user.uuid}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=496490&color=fff&size=80&rounded=true&bold=true`;
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
            <h2 className="text-xl font-semibold text-gray-900">Detalles del usuario</h2>
            {loading && (
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
            )}
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando datos del usuario...</span>
            </div>
          )}

          {/* Estado de error */}
          {error && !loading && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Datos del usuario */}
          {user && !loading && !error && (
            <>
              {/* Avatar y nombre */}
              <div className="mb-6 flex items-center gap-4">
                <img
                  src={getAvatarUrl(user)}
                  alt={`Avatar de ${user.fullName}`}
                  className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                  <p className="text-gray-600">
                    {user.username ? `@${user.username}` : `ID: ${user.id || user.uuid}`}
                  </p>
                </div>
              </div>

              {/* Información detallada */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">UUID</label>
                  <p className="rounded bg-gray-50 px-2 py-1 font-mono text-xs break-all text-gray-900">
                    {user.uuid}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Nombre de usuario
                  </label>
                  <p className="text-sm text-gray-900">{user.username}</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Correo electrónico
                  </label>
                  <p className="text-sm text-gray-900">{user.email || "No especificado"}</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Rol</label>
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

                {user.createdAt && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Fecha de creación
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="rounded-b-lg bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#496490" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

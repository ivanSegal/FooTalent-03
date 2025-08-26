import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

export const DeleteUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onDeleteUser: (userId: string) => Promise<void>;
}> = ({ isOpen, onClose, user, onDeleteUser }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);   
    try {
      await onDeleteUser(user.uuid);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Eliminar usuario</h2>
              <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-gray-700">¿Está seguro de que desea eliminar al usuario:</p>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-semibold text-gray-900">{user.fullName || user.username}</p>
              <p className="text-sm text-gray-600">
                @{user.username} • {user.role.replace("_", " ")}
              </p>
            </div>
            <p className="mt-3 text-sm text-red-600">
              ⚠️ Se eliminarán todos los datos asociados a este usuario.
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-b-lg bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
          >
            {loading && <LoadingOutlined spin />}
            Eliminar usuario
          </button>
        </div>
      </div>
    </div>
  );
};

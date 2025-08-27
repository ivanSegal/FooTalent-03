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
    <div className="backdrop-blur-sm bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="p-8 text-center">
          {/* Warning Triangle Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-400">
              <svg
                className="h-8 w-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L1 21h22L12 2zm0 3.83L19.31 19H4.69L12 5.83zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold text-gray-900">¿Estás seguro?</h2>
          
          {/* Subtitle */}
          <p className="mb-8 text-sm text-gray-500">
            Estás a punto de eliminar permanentemente a {user.fullName || user.username}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-gray-300 py-3 px-4 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            style={{ color: '#FF4D4F', borderColor: '#FF4D4F' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 px-4 font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#FF4D4F' }}
          >
            {loading && <LoadingOutlined spin />}
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
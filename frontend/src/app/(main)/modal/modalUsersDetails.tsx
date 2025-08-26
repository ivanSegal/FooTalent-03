export const UserDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: any;
}> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getRoleLabel = (role: string): string => {
    const roles: Record<string, string> = {
      'ADMIN': 'Administrador',
      'WAREHOUSE_STAFF': 'Personal de Almacén',
      'OPERATIONS_MANAGER': 'Gerente de Operaciones'
    };
    return roles[role] || role;
  };

  const getAvatarUrl = (user: any): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=496490&color=fff&size=80&rounded=true&bold=true`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detalles del usuario
          </h2>

          {/* Avatar y nombre */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={getAvatarUrl(user)}
              alt={`Avatar de ${user.username}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.fullName || user.username}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>

          {/* Información detallada */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ID de usuario
              </label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                {user.uuid}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Correo electrónico
              </label>
              <p className="text-sm text-gray-900">
                {user.email || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Rol
              </label>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                user.role === 'WAREHOUSE_STAFF' ? 'bg-blue-100 text-blue-800' :
                user.role === 'OPERATIONS_MANAGER' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getRoleLabel(user.role)}
              </span>
            </div>

            {user.department && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Departamento
                </label>
                <p className="text-sm text-gray-900">{user.department}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Estado de la cuenta
              </label>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.accountStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Fecha de creación
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#496490' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

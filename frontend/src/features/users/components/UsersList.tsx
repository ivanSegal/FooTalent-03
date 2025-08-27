"use client";

import React from "react";
import { User } from "./../Types/user.types";
import { usersService } from "./../Services/users.service";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

interface UsersListProps {
  users: User[];
  loading: boolean;
  onView: (userId: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  searchTerm?: string;
  hasValidToken?: boolean;
}

export const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  onView,
  onEdit,
  onDelete,
  searchTerm = "",
  hasValidToken = true,
}) => {
  const getRoleStyle = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "border border-red-200 bg-red-100 text-red-800";
      case "WAREHOUSE_STAFF":
        return "border border-blue-200 bg-blue-100 text-blue-800";
      case "OPERATIONS_MANAGER":
        return "border border-green-200 bg-green-100 text-green-800";
      default:
        return "border border-gray-200 bg-gray-100 text-gray-800";
    }
  };

  const getStatusIndicatorColor = (accountStatus: string): string => {
    switch (accountStatus) {
      case "ACTIVE":
        return "bg-green-400";
      case "INACTIVE":
        return "bg-gray-400";
      case "SUSPENDED":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-12 text-center">
        <LoadingOutlined className="mb-4 text-2xl text-blue-500" spin />
        <p className="text-gray-500">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
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
            La búsqueda incluye nombre completo, usuario, email y rol
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {users.map((user) => (
        <div
          key={user.uuid}
          className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
        >
          {/* User with Avatar and Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={usersService.generateAvatarUrl(user)}
                alt={`Avatar de ${user.username}`}
                className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username.charAt(0))}&background=6b7280&color=fff&size=40`;
                }}
              />
              {/* Status indicator */}
              <div
                className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusIndicatorColor(user.accountStatus)}`}
                title={`Estado: ${user.accountStatus}`}
              ></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.fullName || user.username}
              </p>
              {user.email && (
                <p className="truncate text-xs text-gray-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleStyle(user.role)}`}>
              {user.role.replace("_", " ")}
            </span>
            {user.department && (
              <div className="ml-2 text-xs text-gray-500">
                {user.department}
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center">
            <div className="text-sm text-gray-700">
              <div>{usersService.formatDate(user.createdAt)}</div>
              {user.createdAt && (
                <div className="text-xs text-gray-500">
                  {usersService.formatTime(user.createdAt)}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(user.uuid)}
              className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
              title="Ver detalles del usuario"
            >
              <EyeOutlined className="h-4 w-4" />
            </button>

            <button
              onClick={() => onEdit(user)}
              className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
              title="Editar usuario"
            >
              <EditOutlined className="h-4 w-4" />
            </button>

            <button
              onClick={() => onDelete(user)}
              className="group rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Eliminar usuario"
            >
              <DeleteOutlined className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
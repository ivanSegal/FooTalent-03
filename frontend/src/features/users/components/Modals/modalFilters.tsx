"use client";

import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

interface UsersFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { role?: string; department?: string; status?: string }) => void;
}

export const UsersFiltersModal: React.FC<UsersFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ role, department, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <CloseOutlined />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Todos</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="OPERATOR">Operador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Departamento</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Ej: Ventas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="SUSPENDED">Suspendido</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded">
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm text-white rounded"
            style={{ backgroundColor: "#496490", color: "white" }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

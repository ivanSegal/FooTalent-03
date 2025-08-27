"use client";

import React, { useState, useEffect } from "react";
import { User, CreateUserRequest, UpdateUserRequest } from "./../Types/user.types";
import { createUserSchema, updateUserSchema, USER_ROLES, ACCOUNT_STATUS } from "./../Schemas/users.schema";
import {
  CloseOutlined,
  LoadingOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

interface UsersFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  loading?: boolean;
}

export function UsersForm({
  user,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: UsersFormProps) {
  const [formData, setFormData] = useState<{
    username: string;
    fullName: string;
    email: string;
    password?: string; // Hacemos opcional password
    role: string;
    department: string;
    accountStatus: string;
  }>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    department: "",
    accountStatus: "ACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!user;

  // Cargar datos del usuario si está en modo edición
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        department: user.department || "",
        accountStatus: user.accountStatus || "ACTIVE",
      });
    } else if (!user && isOpen) {
      // Resetear formulario para nuevo usuario
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        role: "",
        department: "",
        accountStatus: "ACTIVE",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      if (isEditMode) {
        // Para edición, la contraseña es opcional
        const dataToValidate = { ...formData };
        if (!dataToValidate.password || dataToValidate.password.trim() === "") {
          delete dataToValidate.password;
        }
        updateUserSchema.parse(dataToValidate);
      } else {
        // Para crear, todos los campos son requeridos
        createUserSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const submitData = { ...formData };
      
      // Si es edición y no hay contraseña, no la incluimos
      if (isEditMode && (!submitData.password || submitData.password.trim() === "")) {
        delete submitData.password;
      }

      await onSubmit(submitData as CreateUserRequest | UpdateUserRequest);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || "Error al guardar el usuario" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "",
      department: "",
      accountStatus: "ACTIVE",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <CloseOutlined className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo 
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingrese el nombre completo"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingrese el correo electrónico"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol de usuario
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar rol</option>
                {Object.entries(USER_ROLES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña {isEditMode ? "(dejar vacío para no cambiar)" : ""}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder={isEditMode ? "Nueva contraseña (opcional)" : "Ingrese la contraseña"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined className="h-5 w-5" />
                  ) : (
                    <EyeOutlined className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el departamento (opcional)"
              />
            </div>

            {/* Account Status (solo en modo edición) */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de la cuenta
                </label>
                <select
                  value={formData.accountStatus}
                  onChange={(e) => handleInputChange("accountStatus", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(ACCOUNT_STATUS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Error general */}
            {errors.submit && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "#496490", color: "white" }}
            >
              {(submitting || loading) && <LoadingOutlined spin />}
              {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
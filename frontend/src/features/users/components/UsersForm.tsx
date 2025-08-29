"use client";

import React, { useState, useEffect } from "react";
import { User, CreateUserRequest, UpdateUserRequest } from "./../Types/user.types";
import {
  createUserSchema,
  updateUserSchema,
  USER_ROLES,
  ACCOUNT_STATUS,
} from "./../Schemas/users.schema";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";

interface UsersFormProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (userData: CreateUserRequest) => Promise<void>;
  onEdit?: (userId: string, userData: UpdateUserRequest) => Promise<void>;
  loading?: boolean;
}

export function UsersForm({ user, isOpen, onClose, onCreate, onEdit, loading }: UsersFormProps) {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
    department: string;
    accountStatus: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    department: "",
    accountStatus: "ACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!user;

  const departments = [
    { value: "INVENTORY", label: "Inventario" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
    { value: "VESSEL", label: "Embarcaciones" },
  ];

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        department: user.department || "",
        accountStatus: user.accountStatus || "ACTIVE",
      });
    } else if (!user && isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      const dataToValidate = { ...formData };

      if (isEditMode) {
        // En edición, validamos los campos requeridos para actualizar
        updateUserSchema.parse(dataToValidate);
      } else {
        // En creación, validamos todos los campos requeridos
        createUserSchema.parse(dataToValidate);
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
    console.log("1. Submit iniciado, isEditMode:", isEditMode); // Debug
    console.log("2. FormData:", formData); // Debug

    if (!validateForm()) {
      console.log("3. Validación falló, errores:", errors); // Debug
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && user && onEdit) {
        console.log("4. Entrando a edición");
        const userId = user.uuid || user.id;
        if (!userId) {
          setErrors({ submit: "ID de usuario no definido" });
          setSubmitting(false);
          return;
        }
        const updateData: UpdateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          department: formData.department,
          accountStatus: formData.accountStatus,
        };

        await onEdit(userId, updateData);
        console.log("✔ Usuario actualizado");
      } else if (!isEditMode && onCreate) {
        console.log("4. Entrando a creación");
        const createData: CreateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password || "",
          role: formData.role,
          department: formData.department,
          accountStatus: formData.accountStatus,
        };
        await onCreate(createData);
        console.log("✔ Usuario creado");
      }

      onClose();
    } catch (error: any) {
      console.error("❌ Error en submit:", error);
      setErrors({ submit: error.message || "Error al guardar el usuario" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
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
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
            {/* Campos comunes (crear/editar) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            {/* Campos para CREAR */}
            {!isEditMode && (
              <>
                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
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
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Departamento</label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.department ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar un departamento...</option>
                {departments.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* AccountStatus solo en edición */}
            {isEditMode && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Estado de la cuenta
                </label>
                <select
                  value={formData.accountStatus}
                  onChange={(e) => handleInputChange("accountStatus", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {Object.entries(ACCOUNT_STATUS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-white"
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

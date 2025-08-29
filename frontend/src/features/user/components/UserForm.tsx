"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  UserSwitchOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { userSchema, type UserInput, type UserValues } from "@/features/user/schemas/user.schema";
import { userService } from "@/features/user/services/user.service";
import { showAlert } from "@/utils/showAlert";
import type { UserListItem } from "@/features/user/types/user.types";

// zod schema imported via userSchema types

const schema = userSchema;

interface Props {
  current?: UserListItem | null;
  onSaved?: (u: UserListItem) => void;
  onClose?: () => void;
}

const defaultValues: Partial<UserInput> = {
  firstName: "",
  lastName: "",
  email: "",
  role: "OPERATOR",
  department: null,
  accountStatus: "ACTIVE",
};

export const UserForm: React.FC<Props> = ({ current, onSaved, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({ resolver: zodResolver(schema), defaultValues, mode: "onChange" });

  React.useEffect(() => {
    if (current) reset(current as unknown as UserInput);
    else reset(defaultValues);
  }, [current, reset]);

  const onSubmit = async (raw: UserInput) => {
    try {
      const payload: UserValues = schema.parse(raw);
      let saved: UserListItem;
      if (current?.id) saved = await userService.update(current.id, payload);
      else saved = await userService.create(payload);
      await showAlert("Éxito", "Usuario guardado correctamente", "success");
      onSaved?.(saved);
      onClose?.();
    } catch (err: unknown) {
      let message = "Ocurrió un error al guardar el usuario";
      if (err && typeof err === "object") {
        const maybeAxios = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = maybeAxios.response?.data?.message || maybeAxios.message || message;
      }
      await showAlert("Error", message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="firstName">
            <span className="inline-flex items-center gap-1">
              <UserOutlined />
              Nombre
            </span>
          </label>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                id="firstName"
                placeholder="Ej: Juan"
                {...field}
                status={errors.firstName ? "error" : undefined}
              />
            )}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="lastName">
            <span className="inline-flex items-center gap-1">
              <IdcardOutlined />
              Apellido
            </span>
          </label>
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                id="lastName"
                placeholder="Ej: Pérez"
                {...field}
                status={errors.lastName ? "error" : undefined}
              />
            )}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="email">
            <span className="inline-flex items-center gap-1">
              <MailOutlined />
              Email
            </span>
          </label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                id="email"
                placeholder="Ej: juan.perez@empresa.com"
                {...field}
                status={errors.email ? "error" : undefined}
              />
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="role">
            <span className="inline-flex items-center gap-1">
              <UserSwitchOutlined />
              Rol
            </span>
          </label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                id="role"
                placeholder="Ej: Operador"
                {...field}
                options={[
                  { label: "Administrador", value: "ADMIN" },
                  { label: "Supervisor", value: "SUPERVISOR" },
                  { label: "Operador", value: "OPERATOR" },
                ]}
                status={errors.role ? "error" : undefined}
              />
            )}
          />
          {errors.role && (
            <p className="mt-1 text-xs text-red-600">{errors.role.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="department">
            <span className="inline-flex items-center gap-1">
              <ApartmentOutlined />
              Departamento
            </span>
          </label>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select
                id="department"
                {...field}
                allowClear
                placeholder="Ej: Mantenimiento"
                options={[
                  { label: "Inventario", value: "INVENTORY" },
                  { label: "Mantenimiento", value: "MAINTENANCE" },
                  { label: "Embarcaciones", value: "VESSEL" },
                ]}
                status={errors.department ? "error" : undefined}
              />
            )}
          />
          {errors.department && (
            <p className="mt-1 text-xs text-red-600">{errors.department.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="accountStatus">
            <span className="inline-flex items-center gap-1">
              <SafetyCertificateOutlined />
              Estado de cuenta
            </span>
          </label>
          <Controller
            control={control}
            name="accountStatus"
            render={({ field }) => (
              <Select
                id="accountStatus"
                placeholder="Ej: Activo"
                {...field}
                options={[
                  { label: "Activo", value: "ACTIVE" },
                  { label: "Inactivo", value: "INACTIVE" },
                ]}
                status={errors.accountStatus ? "error" : undefined}
              />
            )}
          />
          {errors.accountStatus && (
            <p className="mt-1 text-xs text-red-600">{errors.accountStatus.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-2">
        {onClose && (
          <Button htmlType="button" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button htmlType="submit" type="primary" loading={isSubmitting}>
          {isSubmitting ? "Guardando..." : current?.id ? "Modificar Usuario" : "Agregar Usuario"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

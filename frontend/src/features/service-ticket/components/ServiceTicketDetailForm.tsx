"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Select } from "antd";
import {
  AppstoreOutlined,
  ToolOutlined,
  FileTextOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import {
  serviceTicketDetailSchema,
  type ServiceTicketDetailInput,
  type ServiceTicketDetailValues,
} from "@/features/service-ticket/schemas/serviceTicketDetail.schema";
import { serviceTicketDetailService } from "@/features/service-ticket/services/serviceTicketDetail.service";
import type { ServiceTicketDetail } from "@/features/service-ticket/types/serviceTicketDetail.types";
import { showAlert } from "@/utils/showAlert";

interface Props {
  serviceTicketId: number;
  current?: ServiceTicketDetail | null;
  onSaved?: (detail: ServiceTicketDetail) => void;
  onClose?: () => void;
}

const defaultValues: Partial<ServiceTicketDetailInput> = {
  serviceArea: "",
  serviceType: "",
  description: "",
  patronFullName: "",
  marinerFullName: "",
  captainFullName: "",
};
// Tipos de servicio sugeridos
const SERVICE_TYPES: { value: string; label: string }[] = [
  { value: "Carga", label: "Carga" },
  { value: "Transporte de pasajeros", label: "Transporte de pasajeros" },
  { value: "Investigación", label: "Investigación" },
  { value: "Servicios offshore", label: "Servicios offshore" },
];
export const ServiceTicketDetailForm: React.FC<Props> = ({
  serviceTicketId,
  current,
  onSaved,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceTicketDetailInput>({
    resolver: zodResolver(serviceTicketDetailSchema),
    defaultValues: { ...defaultValues, serviceTicketId },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (current) reset({ ...current });
    else reset({ ...defaultValues, serviceTicketId });
  }, [current, reset, serviceTicketId]);

  // Auto-cargar detalle asociado si no se proporcionó `current`
  React.useEffect(() => {
    let abort = false;
    (async () => {
      if (!current && serviceTicketId) {
        try {
          const existing = await serviceTicketDetailService.getOneByServiceTicket(serviceTicketId);
          if (!abort && existing) {
            reset({ ...(existing as unknown as ServiceTicketDetailInput) });
          }
        } catch {
          // ignorar si no hay detalle
        }
      }
    })();
    return () => {
      abort = true;
    };
  }, [current, reset, serviceTicketId]);

  const onSubmit = async (raw: ServiceTicketDetailInput) => {
    try {
      const payload: ServiceTicketDetailValues = serviceTicketDetailSchema.parse(raw);
      let saved: ServiceTicketDetail;
      if (current?.id) saved = await serviceTicketDetailService.update(current.id, payload);
      else saved = await serviceTicketDetailService.create(payload);
      await showAlert("Éxito", "Detalle guardado correctamente.", "success");
      onSaved?.(saved);
      onClose?.();
    } catch (e) {
      await showAlert(
        "No se pudo guardar",
        (e as Error)?.message || "Ocurrió un error. Intenta nuevamente.",
        "error",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="serviceArea">
            <span className="inline-flex items-center gap-1">
              <AppstoreOutlined />
              Área de servicio
            </span>
          </label>
          <Controller
            control={control}
            name="serviceArea"
            render={({ field }) => (
              <Input
                id="serviceArea"
                placeholder="Ej: Bahía de Pozuelos"
                {...field}
                status={errors.serviceArea ? "error" : undefined}
              />
            )}
          />
          {errors.serviceArea && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceArea.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="serviceType">
            <span className="inline-flex items-center gap-1">
              <ToolOutlined />
              Tipo de servicio
            </span>
          </label>
          <Controller
            control={control}
            name="serviceType"
            render={({ field }) => (
              <Select
                {...field}
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                showSearch
                allowClear
                placeholder="Ej: Transporte de pasajeros"
                options={SERVICE_TYPES}
                optionFilterProp="label"
                status={errors.serviceType ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.serviceType && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceType.message as string}</p>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="description">
            <span className="inline-flex items-center gap-1">
              <FileTextOutlined />
              Descripción del servicio
            </span>
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input.TextArea
                id="description"
                rows={3}
                placeholder="Ej: Se realizó el transporte de 50 pasajeros desde el puerto A al puerto B"
                {...field}
                status={errors.description ? "error" : undefined}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="patronFullName">
            <span className="inline-flex items-center gap-1">
              <UserOutlined />
              Patrón
            </span>
          </label>
          <Controller
            control={control}
            name="patronFullName"
            render={({ field }) => (
              <Input
                id="patronFullName"
                placeholder="Ej: Juan Pérez"
                {...field}
                status={errors.patronFullName ? "error" : undefined}
              />
            )}
          />
          {errors.patronFullName && (
            <p className="mt-1 text-xs text-red-600">{errors.patronFullName.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="marinerFullName">
            <span className="inline-flex items-center gap-1">
              <UserOutlined />
              Marinero
            </span>
          </label>
          <Controller
            control={control}
            name="marinerFullName"
            render={({ field }) => (
              <Input
                id="marinerFullName"
                placeholder="Ej: Luis Gómez"
                {...field}
                status={errors.marinerFullName ? "error" : undefined}
              />
            )}
          />
          {errors.marinerFullName && (
            <p className="mt-1 text-xs text-red-600">{errors.marinerFullName.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="captainFullName">
            <span className="inline-flex items-center gap-1">
              <CrownOutlined />
              Capitán
            </span>
          </label>
          <Controller
            control={control}
            name="captainFullName"
            render={({ field }) => (
              <Input
                id="captainFullName"
                placeholder="Ej: Carlos Ramírez"
                {...field}
                status={errors.captainFullName ? "error" : undefined}
              />
            )}
          />
          {errors.captainFullName && (
            <p className="mt-1 text-xs text-red-600">{errors.captainFullName.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-2">
        <Button onClick={onClose} className="w-full">
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full">
          {isSubmitting
            ? "Guardando..."
            : current?.id
              ? "Modificar Boleta Detalle"
              : "Agregar Boleta Detalle"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceTicketDetailForm;

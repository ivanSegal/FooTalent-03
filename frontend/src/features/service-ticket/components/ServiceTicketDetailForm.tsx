"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, TimePicker } from "antd";
import dayjs from "dayjs";
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
  hoursTraveled: "00:00",
  patronFullName: "",
  marinerFullName: "",
  captainFullName: "",
};

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
            Área de servicio
          </label>
          <Controller
            control={control}
            name="serviceArea"
            render={({ field }) => (
              <Input
                id="serviceArea"
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
            Tipo de servicio
          </label>
          <Controller
            control={control}
            name="serviceType"
            render={({ field }) => (
              <Input
                id="serviceType"
                {...field}
                status={errors.serviceType ? "error" : undefined}
              />
            )}
          />
          {errors.serviceType && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceType.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="hoursTraveled">
            Horas navegadas
          </label>
          <Controller
            control={control}
            name="hoursTraveled"
            render={({ field }) => (
              <TimePicker
                id="hoursTraveled"
                format="HH:mm"
                value={field.value ? dayjs(field.value, "HH:mm") : null}
                onChange={(d) => field.onChange(d ? d.format("HH:mm") : "00:00")}
                className="w-full"
                status={errors.hoursTraveled ? "error" : undefined}
              />
            )}
          />
          {errors.hoursTraveled && (
            <p className="mt-1 text-xs text-red-600">{errors.hoursTraveled.message as string}</p>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="description">
            Descripción del servicio
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input.TextArea
                id="description"
                rows={3}
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
            Patrón
          </label>
          <Controller
            control={control}
            name="patronFullName"
            render={({ field }) => (
              <Input
                id="patronFullName"
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
            Marinero
          </label>
          <Controller
            control={control}
            name="marinerFullName"
            render={({ field }) => (
              <Input
                id="marinerFullName"
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
            Capitán
          </label>
          <Controller
            control={control}
            name="captainFullName"
            render={({ field }) => (
              <Input
                id="captainFullName"
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

      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <Button htmlType="button" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button htmlType="submit" type="primary" loading={isSubmitting}>
          {isSubmitting ? "Guardando..." : current?.id ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceTicketDetailForm;

"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, TimePicker } from "antd";
import dayjs from "dayjs";
import {
  serviceTicketTravelSchema,
  type ServiceTicketTravelInput,
  type ServiceTicketTravelValues,
} from "@/features/service-ticket/schemas/serviceTicketTravel.schema";
import { serviceTicketTravelService } from "@/features/service-ticket/services/serviceTicketTravel.service";
import type { ServiceTicketTravel } from "@/features/service-ticket/types/serviceTicketTravel.types";
import { showAlert } from "@/utils/showAlert";

interface Props {
  serviceTicketDetailId: number;
  current?: ServiceTicketTravel | null;
  onSaved?: (travel: ServiceTicketTravel) => void;
  onClose?: () => void;
}

const defaultValues: Partial<ServiceTicketTravelInput> = {
  origin: "",
  destination: "",
  departureTime: "00:00",
  arrivalTime: "00:00",
};

export const ServiceTicketTravelForm: React.FC<Props> = ({
  serviceTicketDetailId,
  current,
  onSaved,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceTicketTravelInput>({
    resolver: zodResolver(serviceTicketTravelSchema),
    defaultValues: { ...defaultValues, serviceTicketDetailId },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (current) {
      const sanitize = (t?: string) => (t && t.length >= 5 ? t.slice(0, 5) : "00:00");
      reset({
        ...current,
        departureTime: sanitize(current.departureTime),
        arrivalTime: sanitize(current.arrivalTime),
      });
    } else {
      reset({ ...defaultValues, serviceTicketDetailId });
    }
  }, [current, reset, serviceTicketDetailId]);

  const onSubmit = async (raw: ServiceTicketTravelInput) => {
    try {
      const payload: ServiceTicketTravelValues = serviceTicketTravelSchema.parse(raw);
      let saved: ServiceTicketTravel;
      if (current?.id) saved = await serviceTicketTravelService.update(current.id, payload);
      else saved = await serviceTicketTravelService.create(payload);
      await showAlert("Éxito", "Viaje guardado correctamente.", "success");
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col md:col-span-1">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="origin">
            Origen
          </label>
          <Controller
            control={control}
            name="origin"
            render={({ field }) => (
              <Input id="origin" {...field} status={errors.origin ? "error" : undefined} />
            )}
          />
          {errors.origin && (
            <p className="mt-1 text-xs text-red-600">{errors.origin.message as string}</p>
          )}
        </div>

        <div className="flex flex-col md:col-span-1">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="destination">
            Destino
          </label>
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <Input
                id="destination"
                {...field}
                status={errors.destination ? "error" : undefined}
              />
            )}
          />
          {errors.destination && (
            <p className="mt-1 text-xs text-red-600">{errors.destination.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="departureTime">
            Hora salida
          </label>
          <Controller
            control={control}
            name="departureTime"
            render={({ field }) => (
              <TimePicker
                id="departureTime"
                format="HH:mm"
                value={field.value ? dayjs(field.value, "HH:mm") : null}
                onChange={(d) => field.onChange(d ? d.format("HH:mm") : "00:00")}
                className="w-full"
                status={errors.departureTime ? "error" : undefined}
              />
            )}
          />
          {errors.departureTime && (
            <p className="mt-1 text-xs text-red-600">{errors.departureTime.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="arrivalTime">
            Hora llegada
          </label>
          <Controller
            control={control}
            name="arrivalTime"
            render={({ field }) => (
              <TimePicker
                id="arrivalTime"
                format="HH:mm"
                value={field.value ? dayjs(field.value, "HH:mm") : null}
                onChange={(d) => field.onChange(d ? d.format("HH:mm") : "00:00")}
                className="w-full"
                status={errors.arrivalTime ? "error" : undefined}
              />
            )}
          />
          {errors.arrivalTime && (
            <p className="mt-1 text-xs text-red-600">{errors.arrivalTime.message as string}</p>
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

export default ServiceTicketTravelForm;

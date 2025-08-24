"use client";

import React, { useEffect } from "react";
import { useForm, Controller, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import {
  serviceTicketSchema,
  type ServiceTicketFormValues,
} from "@/features/service-ticket/schemas/serviceTicket.schema";
import { serviceTicketService, type ServiceTicketListItem } from "@/features/service-ticket";

interface Props {
  items: ServiceTicketListItem[];
  setItems: React.Dispatch<React.SetStateAction<ServiceTicketListItem[]>>;
  current: ServiceTicketListItem | null;
  onClose: () => void;
}

const defaultValues: Partial<ServiceTicketFormValues> = {
  travelNro: 0,
  travelDate: "",
  vesselAttended: "",
  solicitedBy: "",
  reportTravelNro: "",
  code: "",
  checkingNro: 0,
  boatName: "",
  responsibleUsername: "",
};

export const ServiceTicketForm: React.FC<Props> = ({ items, setItems, current, onClose }) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
  } = useForm<ServiceTicketFormValues>({
    resolver: zodResolver(serviceTicketSchema) as unknown as Resolver<ServiceTicketFormValues>,
    defaultValues,
  });

  useEffect(() => {
    if (current) {
      reset({ ...defaultValues, ...current } as ServiceTicketFormValues);
    } else {
      reset(defaultValues as ServiceTicketFormValues);
    }
  }, [current, reset]);

  const onSubmit: SubmitHandler<ServiceTicketFormValues> = async (data) => {
    try {
      if (current) {
        const updated = await serviceTicketService.update(current.id, data);
        setItems(items.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await serviceTicketService.create(data);
        setItems([created, ...items]);
      }
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="travelNro">
            N° Viaje
          </label>
          <Controller
            control={control}
            name="travelNro"
            render={({ field }) => (
              <Input id="travelNro" type="number" {...field} value={field.value ?? 0} />
            )}
          />
          {errors.travelNro && (
            <p className="mt-1 text-xs text-red-600">{errors.travelNro.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="travelDate">
            Fecha de viaje
          </label>
          <Controller
            control={control}
            name="travelDate"
            render={({ field }) => (
              <DatePicker
                id="travelDate"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : "")}
                className="w-full"
              />
            )}
          />
          {errors.travelDate && (
            <p className="mt-1 text-xs text-red-600">{errors.travelDate.message as string}</p>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="vesselAttended">
            Embarcación atendida
          </label>
          <Controller
            control={control}
            name="vesselAttended"
            render={({ field }) => (
              <Input
                id="vesselAttended"
                placeholder="Nombre"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          {errors.vesselAttended && (
            <p className="mt-1 text-xs text-red-600">{errors.vesselAttended.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="solicitedBy">
            Solicitado por
          </label>
          <Controller
            control={control}
            name="solicitedBy"
            render={({ field }) => (
              <Input
                id="solicitedBy"
                placeholder="Solicitante"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="responsibleUsername">
            Responsable
          </label>
          <Controller
            control={control}
            name="responsibleUsername"
            render={({ field }) => (
              <Input
                id="responsibleUsername"
                placeholder="Responsable"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="reportTravelNro">
            N° Reporte de Viaje
          </label>
          <Controller
            control={control}
            name="reportTravelNro"
            render={({ field }) => (
              <Input
                id="reportTravelNro"
                placeholder="RNE-XX-YYY"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="checkingNro">
            N° Control
          </label>
          <Controller
            control={control}
            name="checkingNro"
            render={({ field }) => (
              <Input id="checkingNro" type="number" {...field} value={field.value ?? 0} />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="code">
            Código
          </label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input id="code" placeholder="Código" {...field} value={field.value ?? ""} />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="boatName">
            Nombre del barco
          </label>
          <Controller
            control={control}
            name="boatName"
            render={({ field }) => (
              <Input id="boatName" placeholder="Barco" {...field} value={field.value ?? ""} />
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <Button htmlType="button" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button htmlType="submit" type="primary" loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isDirty ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceTicketForm;

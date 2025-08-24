"use client";

import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  type SubmitHandler,
  type Resolver,
  type Path,
  type ErrorOption,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, DatePicker, Button, Select } from "antd";
import dayjs from "dayjs";
import {
  serviceTicketSchema,
  type ServiceTicketFormValues,
} from "@/features/service-ticket/schemas/serviceTicket.schema";
import { serviceTicketService, type ServiceTicketListItem } from "@/features/service-ticket";
import { showAlert } from "@/utils/showAlert";
import { vasselsService, type Vassel } from "@/features/vassels";
import type { NormalizedApiError } from "@/types/api";

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
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    control,
    setError,
    setFocus,
  } = useForm<ServiceTicketFormValues>({
    resolver: zodResolver(serviceTicketSchema) as unknown as Resolver<ServiceTicketFormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  // Cargar embarcaciones para el select
  const [vassels, setVassels] = React.useState<Vassel[]>([]);
  useEffect(() => {
    void (async () => {
      try {
        const res = await vasselsService.list({ page: 0, size: 100 });
        setVassels(res.content);
      } catch {
        // opcional: ignorar error silenciosamente
      }
    })();
  }, []);

  useEffect(() => {
    if (current) {
      reset({ ...defaultValues, ...current } as ServiceTicketFormValues);
    } else {
      reset(defaultValues as ServiceTicketFormValues);
    }
  }, [current, reset]);

  const onSubmit: SubmitHandler<ServiceTicketFormValues> = async (data) => {
    try {
      // Incluir boatId si el usuario eligió una embarcación
      const selected = vassels.find((v) => v.name === data.boatName);
      const payload = selected ? { ...data, boatId: selected.id } : data;
      if (current) {
        const updated = await serviceTicketService.update(current.id, payload);
        setItems(items.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await serviceTicketService.create(payload);
        setItems([created, ...items]);
        reset();
      }
      onClose();
    } catch (e) {
      const apiErr = e as NormalizedApiError;
      // Aplica errores sólo a campos conocidos del formulario
      if (apiErr?.fieldErrors) {
        const keys: Array<keyof ServiceTicketFormValues> = [
          "travelNro",
          "travelDate",
          "vesselAttended",
          "solicitedBy",
          "reportTravelNro",
          "code",
          "checkingNro",
          "boatName",
        ];
        for (const k of keys) {
          const msg = apiErr.fieldErrors[k as string];
          if (msg) {
            setError(
              k as Path<ServiceTicketFormValues>,
              {
                type: "server",
                message: String(msg),
              } as ErrorOption,
            );
          }
        }
      }
      await showAlert(
        "No se pudo guardar",
        apiErr?.message || "Ocurrió un error. Intenta nuevamente.",
        "error",
      );
    }
  };

  const onInvalid = async (formErrors: FieldErrors<ServiceTicketFormValues>) => {
    // Enfocar el primer campo con error y mostrar alerta
    const first = Object.keys(formErrors)[0] as Path<ServiceTicketFormValues> | undefined;
    if (first) setFocus(first);
    await showAlert(
      "Completa los campos requeridos",
      "Revisa los campos marcados en rojo.",
      "warning",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="travelNro">
            N° Viaje
          </label>
          <Controller
            control={control}
            name="travelNro"
            render={({ field }) => (
              <Input
                id="travelNro"
                type="number"
                {...field}
                value={field.value ?? 0}
                status={errors.travelNro ? "error" : undefined}
              />
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
                status={errors.travelDate ? "error" : undefined}
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
                status={errors.vesselAttended ? "error" : undefined}
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
                status={errors.solicitedBy ? "error" : undefined}
              />
            )}
          />
          {errors.solicitedBy && (
            <p className="mt-1 text-xs text-red-600">{errors.solicitedBy.message as string}</p>
          )}
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
                status={errors.reportTravelNro ? "error" : undefined}
              />
            )}
          />
          {errors.reportTravelNro && (
            <p className="mt-1 text-xs text-red-600">{errors.reportTravelNro.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="checkingNro">
            N° Control
          </label>
          <Controller
            control={control}
            name="checkingNro"
            render={({ field }) => (
              <Input
                id="checkingNro"
                type="number"
                {...field}
                value={field.value ?? 0}
                status={errors.checkingNro ? "error" : undefined}
              />
            )}
          />
          {errors.checkingNro && (
            <p className="mt-1 text-xs text-red-600">{errors.checkingNro.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="code">
            Código
          </label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="code"
                placeholder="Código"
                {...field}
                value={field.value ?? ""}
                status={errors.code ? "error" : undefined}
              />
            )}
          />
          {errors.code && (
            <p className="mt-1 text-xs text-red-600">{errors.code.message as string}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="boatName">
            Embarcación
          </label>
          <Controller
            control={control}
            name="boatName"
            render={({ field }) => (
              <Select
                id="boatName"
                showSearch
                placeholder="Selecciona embarcación"
                optionFilterProp="label"
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(val)}
                options={vassels.map((v) => ({ label: v.name, value: v.name }))}
                status={errors.boatName ? "error" : undefined}
              />
            )}
          />
          {errors.boatName && (
            <p className="mt-1 text-xs text-red-600">{errors.boatName.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <Button htmlType="button" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button
          htmlType="submit"
          type="primary"
          loading={isSubmitting}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Guardando..." : isDirty ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceTicketForm;

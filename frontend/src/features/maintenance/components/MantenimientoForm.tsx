"use client";
import React, { useEffect, useMemo } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  mantenimientoSchema,
  type MantenimientoFormValues,
} from "@/features/mantenimiento/schemas/mantenimiento.schema";

const { TextArea } = Input;

interface Props {
  initialValues?: Partial<MantenimientoFormValues>;
  onSubmit: (values: MantenimientoFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: Partial<MantenimientoFormValues> = {
  vesselName: "",
  maintenanceReason: "",
  maintenanceManager: "",
  maintenanceType: "PREVENTIVO",
  status: "SOLICITADO",
  issuedAt: null,
  scheduledAt: null,
  startedAt: null,
  finishedAt: null,
};

dayjs.extend(customParseFormat);

export const MantenimientoForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  // Merge sin sobrescribir con undefined
  const mergedDefaults = useMemo(() => {
    const iv = initialValues ?? {};
    const clean = Object.fromEntries(
      Object.entries(iv).filter(([, v]) => v !== undefined),
    ) as Partial<MantenimientoFormValues>;
    return { ...defaultValues, ...clean };
  }, [initialValues]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
  } = useForm<MantenimientoFormValues>({
    resolver: zodResolver(mantenimientoSchema),
    defaultValues: mergedDefaults,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset(mergedDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedDefaults]);

  const submit: SubmitHandler<MantenimientoFormValues> = (data) => {
    onSubmit(data);
  };
  console.log("errors", errors);
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Embarcación */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="vesselName">
            Embarcación
          </label>
          <Input
            id="vesselName"
            placeholder="Nombre / código"
            {...register("vesselName")}
            status={errors.vesselName ? "error" : undefined}
          />
          {errors.vesselName && (
            <p className="mt-1 text-xs text-red-600">{errors.vesselName.message as string}</p>
          )}
        </div>
        {/* Responsable */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="maintenanceManager">
            Responsable
          </label>
          <Input
            id="maintenanceManager"
            placeholder="Nombre"
            {...register("maintenanceManager")}
            status={errors.maintenanceManager ? "error" : undefined}
          />
          {errors.maintenanceManager && (
            <p className="mt-1 text-xs text-red-600">
              {errors.maintenanceManager.message as string}
            </p>
          )}
        </div>
        {/* Descripción */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="maintenanceReason">
            Motivo / Descripción
          </label>
          <TextArea
            id="maintenanceReason"
            placeholder="Describe la tarea de mantenimiento"
            autoSize={{ minRows: 3 }}
            {...register("maintenanceReason")}
            status={errors.maintenanceReason ? "error" : undefined}
          />
          {errors.maintenanceReason && (
            <p className="mt-1 text-xs text-red-600">
              {errors.maintenanceReason.message as string}
            </p>
          )}
        </div>
        {/* Tipo de mantenimiento */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="maintenanceType">
            Tipo de mantenimiento
          </label>
          <Controller
            control={control}
            name="maintenanceType"
            render={({ field }) => (
              <Select
                id="maintenanceType"
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                options={[
                  { label: "Preventivo", value: "PREVENTIVO" },
                  { label: "Correctivo", value: "CORRECTIVO" },
                ]}
              />
            )}
          />
        </div>
        {/* Estado */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="status">
            Estado
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                id="status"
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                options={[
                  { label: "Solicitado", value: "SOLICITADO" },
                  { label: "Programado", value: "PROGRAMADO" },
                  { label: "En progreso", value: "EN_PROGRESO" },
                  { label: "Finalizado", value: "FINALIZADO" },
                ]}
              />
            )}
          />
        </div>
        {/* Fechas */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="issuedAt">
            Fecha Emisión
          </label>
          <Controller
            control={control}
            name="issuedAt"
            render={({ field }) => (
              <DatePicker
                id="issuedAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="scheduledAt">
            Fecha Programada
          </label>
          <Controller
            control={control}
            name="scheduledAt"
            render={({ field }) => (
              <DatePicker
                id="scheduledAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="startedAt">
            Fecha Inicio
          </label>
          <Controller
            control={control}
            name="startedAt"
            render={({ field }) => (
              <DatePicker
                id="startedAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="finishedAt">
            Fecha Fin
          </label>
          <Controller
            control={control}
            name="finishedAt"
            render={({ field }) => (
              <DatePicker
                id="finishedAt"
                format="DD-MM-YYYY"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value as string, "DD-MM-YYYY") : null}
                onChange={(d) => field.onChange(d ? d.format("DD-MM-YYYY") : null)}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : isDirty ? "Guardar cambios" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default MantenimientoForm;

"use client";
import React, { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

const mantenimientoSchema = z
  .object({
    id: z.number().int().positive().optional(),
    embarcacion: z.string().min(1, "Requerido"),
    tarea: z.string().min(5, "Mínimo 5 caracteres"),
    responsable: z.string().optional(),
    fechaProgramada: z
      .string()
      .optional()
      .refine((v: string | undefined) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Formato inválido",
      }),
    fechaReal: z
      .string()
      .optional()
      .refine((v: string | undefined) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
        message: "Formato inválido",
      }),
    estado: z.enum(["pendiente", "en_progreso", "completado"]),
    costo: z.number().nonnegative({ message: "Debe ser >= 0" }).optional(),
  })
  .refine(
    (data: { fechaProgramada?: string; fechaReal?: string }) => {
      if (data.fechaProgramada && data.fechaReal) {
        return new Date(data.fechaReal) >= new Date(data.fechaProgramada);
      }
      return true;
    },
    { message: "Fecha real debe ser >= programada", path: ["fechaReal"] },
  );

export type MantenimientoFormValues = z.infer<typeof mantenimientoSchema>;

interface Props {
  initialValues?: Partial<MantenimientoFormValues>;
  onSubmit: (values: MantenimientoFormValues) => void;
  onCancel?: () => void;
}

const defaultValues: Partial<MantenimientoFormValues> = {
  embarcacion: "",
  tarea: "",
  responsable: "",
  fechaProgramada: "",
  fechaReal: "",
  estado: "pendiente",
  costo: undefined,
};

export const MantenimientoForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
  } = useForm<MantenimientoFormValues>({
    resolver: zodResolver(mantenimientoSchema),
    defaultValues: { ...defaultValues, ...initialValues },
  });

  useEffect(() => {
    reset({ ...defaultValues, ...initialValues });
  }, [initialValues, reset]);

  const submit: SubmitHandler<MantenimientoFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="embarcacion">
            Embarcación
          </label>
          <Input
            id="embarcacion"
            placeholder="Nombre / código"
            {...register("embarcacion")}
            status={errors.embarcacion ? "error" : undefined}
          />
          {errors.embarcacion && (
            <p className="mt-1 text-xs text-red-600">{errors.embarcacion.message}</p>
          )}
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="tarea">
            Tarea / Descripción
          </label>
          <TextArea
            id="tarea"
            placeholder="Describe la tarea de mantenimiento"
            autoSize={{ minRows: 3 }}
            {...register("tarea")}
            status={errors.tarea ? "error" : undefined}
          />
          {errors.tarea && <p className="mt-1 text-xs text-red-600">{errors.tarea.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="responsable">
            Responsable
          </label>
          <Input
            id="responsable"
            placeholder="Nombre"
            {...register("responsable")}
            status={errors.responsable ? "error" : undefined}
          />
          {errors.responsable && (
            <p className="mt-1 text-xs text-red-600">{errors.responsable.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="estado">
            Estado
          </label>
          <Controller
            control={control}
            name="estado"
            render={({ field }) => (
              <Select
                id="estado"
                {...field}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                status={errors.estado ? "error" : undefined}
                options={[
                  { label: "Pendiente", value: "pendiente" },
                  { label: "En progreso", value: "en_progreso" },
                  { label: "Completado", value: "completado" },
                ]}
              />
            )}
          />
          {errors.estado && <p className="mt-1 text-xs text-red-600">{errors.estado.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="fechaProgramada">
            Fecha Programada
          </label>
          <Controller
            control={control}
            name="fechaProgramada"
            render={({ field }) => (
              <DatePicker
                id="fechaProgramada"
                format="YYYY-MM-DD"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value) : null}
                onChange={(d) => field.onChange(d ? d.format("YYYY-MM-DD") : "")}
                status={errors.fechaProgramada ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.fechaProgramada && (
            <p className="mt-1 text-xs text-red-600">{errors.fechaProgramada.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="fechaReal">
            Fecha Real
          </label>
          <Controller
            control={control}
            name="fechaReal"
            render={({ field }) => (
              <DatePicker
                id="fechaReal"
                format="YYYY-MM-DD"
                placeholder="Selecciona fecha"
                value={field.value ? dayjs(field.value) : null}
                onChange={(d) => field.onChange(d ? d.format("YYYY-MM-DD") : "")}
                status={errors.fechaReal ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.fechaReal && (
            <p className="mt-1 text-xs text-red-600">{errors.fechaReal.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="costo">
            Costo (USD)
          </label>
          <Controller
            control={control}
            name="costo"
            render={({ field }) => (
              <InputNumber
                id="costo"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={field.value}
                onChange={(val) => field.onChange(typeof val === "number" ? val : undefined)}
                status={errors.costo ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.costo && <p className="mt-1 text-xs text-red-600">{errors.costo.message}</p>}
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

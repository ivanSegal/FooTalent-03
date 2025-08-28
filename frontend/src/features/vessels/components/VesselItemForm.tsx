"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, InputNumber, Select } from "antd";
import {
  vesselItemSchema,
  type VesselItemFormValues,
} from "@/features/vessels/schemas/vesselItem.schema";
import type { VesselItem } from "@/features/vessels/types/vesselItem.types";
import { showAlert } from "@/utils/showAlert";
import { vesselItemService } from "@/features/vessels/services/vesselItem.service";

interface Props {
  vesselId: number;
  current?: (VesselItem & { id?: number }) | null;
  onSaved?: (v: VesselItem) => void;
  onCancel?: () => void;
}

export default function VesselItemForm({ vesselId, current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VesselItemFormValues>({
    resolver: zodResolver(vesselItemSchema),
    defaultValues: current ?? {
      name: "",
      description: "",
      controlType: "NAVIGATION",
      accumulatedHours: 0,
      usefulLifeHours: 0,
      alertHours: 0,
      materialType: "COMPONENTS",
    },
  });

  React.useEffect(() => {
    if (current) {
      reset(current);
    }
  }, [current, reset]);

  const onSubmit = async (values: VesselItemFormValues) => {
    try {
      let saved: VesselItem;
      if (current?.id) {
        saved = await vesselItemService.update(current.id, values);
      } else {
        saved = await vesselItemService.create({ ...values, vesselId });
      }
      await showAlert("Éxito", "Item guardado correctamente", "success");
      onSaved?.(saved);
      onCancel?.();
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} status={errors.name ? "error" : undefined} />}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Descripción</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                status={errors.description ? "error" : undefined}
              />
            )}
          />
          {errors.description ? (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de control</label>
          <Controller
            name="controlType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { label: "Navegación", value: "NAVIGATION" },
                  { label: "Comunicación", value: "COMMUNICATION" },
                  { label: "Seguridad", value: "SAFETY" },
                  { label: "Motor", value: "ENGINE" },
                  { label: "Eléctrico", value: "ELECTRICAL" },
                  { label: "Otro", value: "OTHER" },
                ]}
                status={errors.controlType ? "error" : undefined}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Horas acumuladas</label>
          <Controller
            name="accumulatedHours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                status={errors.accumulatedHours ? "error" : undefined}
              />
            )}
          />
          {errors.accumulatedHours ? (
            <p className="mt-1 text-xs text-red-600">{errors.accumulatedHours.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Vida útil (horas)</label>
          <Controller
            name="usefulLifeHours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                status={errors.usefulLifeHours ? "error" : undefined}
              />
            )}
          />
          {errors.usefulLifeHours ? (
            <p className="mt-1 text-xs text-red-600">{errors.usefulLifeHours.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Horas de alerta</label>
          <Controller
            name="alertHours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                status={errors.alertHours ? "error" : undefined}
              />
            )}
          />
          {errors.alertHours ? (
            <p className="mt-1 text-xs text-red-600">{errors.alertHours.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de material</label>
          <Controller
            name="materialType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { label: "Componentes", value: "COMPONENTS" },
                  { label: "Consumibles", value: "CONSUMABLES" },
                  { label: "Repuestos", value: "SPARE_PARTS" },
                  { label: "Herramientas", value: "TOOLS" },
                  { label: "Otro", value: "OTHER" },
                ]}
                status={errors.materialType ? "error" : undefined}
              />
            )}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}

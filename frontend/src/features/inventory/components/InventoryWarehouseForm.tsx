"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import {
  inventoryWarehouseSchema,
  type InventoryWarehouseFormValues,
} from "@/features/inventory/schemas/inventoryWarehouses.schema";
import type { Warehouse } from "@/features/inventory/types/inventoryWarehouses.types";
import { showAlert } from "@/utils/showAlert";
import inventoryWarehousesService from "@/features/inventory/services/inventoryWarehouses.service";

interface Props {
  current?: Warehouse | null;
  onSaved?: (w: Warehouse) => void;
  onCancel?: () => void;
}

export default function InventoryWarehouseForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InventoryWarehouseFormValues>({
    resolver: zodResolver(inventoryWarehouseSchema),
    defaultValues: current
      ? { name: current.name, location: current.location }
      : { name: "", location: "" },
  });

  const onSubmit: (values: InventoryWarehouseFormValues) => Promise<void> = async (values) => {
    try {
      console.log("Submitting form with values:", values);
      // Siguiendo la lógica de MaintenanceForm: el form llama al servicio
      const saved = current?.id
        ? await inventoryWarehousesService.update(current.id, values)
        : await inventoryWarehousesService.create(values);
      onSaved?.(saved);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; fieldErrors?: Record<string, string> };
      const fieldErrors = apiErr?.fieldErrors as Record<string, string> | undefined;
      if (fieldErrors && typeof fieldErrors === "object") {
        for (const [key, message] of Object.entries(fieldErrors)) {
          const k = key as keyof InventoryWarehouseFormValues;
          setError(k, { type: "server", message: String(message) });
        }
      }
      await showAlert(
        "Error al guardar",
        apiErr?.message || "No se pudo guardar el depósito",
        "error",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col md:col-span-1">
          <label className="mb-1 text-sm text-gray-700">Nombre</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} status={errors.name ? "error" : ""} />}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col md:col-span-1">
          <label className="mb-1 text-sm text-gray-700">Ubicación</label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => <Input {...field} status={errors.location ? "error" : ""} />}
          />
          {errors.location && (
            <span className="text-xs text-red-500">{errors.location.message}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button htmlType="submit" type="primary" loading={isSubmitting}>
          {current?.id ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

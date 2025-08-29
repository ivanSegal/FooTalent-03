"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import {
  inventoryWarehouseSchema,
  type InventoryWarehouseFormValues,
} from "@/features/inventory-items/schemas/inventoryWarehouse.schema";
import type { InventoryWarehouse } from "@/features/inventory-items/types/inventoryWarehouse.types";
import { showAlert } from "@/utils/showAlert";
import { inventoryWarehouseService } from "@/features/inventory-items/services/inventoryWarehouse.service";

interface Props {
  current?: (InventoryWarehouse & { id?: number }) | null;
  onSaved?: (v: InventoryWarehouse) => void;
  onCancel?: () => void;
}

export default function InventoryWarehouseForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InventoryWarehouseFormValues>({
    resolver: zodResolver(inventoryWarehouseSchema),
    defaultValues: current ?? { name: "", location: "" },
  });

  React.useEffect(() => {
    if (current) {
      reset({ name: current.name, location: current.location });
    }
  }, [current, reset]);

  const onSubmit = async (values: InventoryWarehouseFormValues) => {
    try {
      let saved: InventoryWarehouse;
      if (current?.id) {
        saved = await inventoryWarehouseService.update(current.id, values);
      } else {
        saved = await inventoryWarehouseService.create(values);
      }
      await showAlert("Éxito", "Almacén guardado correctamente", "success");
      onSaved?.(saved);
      onCancel?.();
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-600">Nombre</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Ej: Depósito Central"
              status={errors.name ? "error" : undefined}
            />
          )}
        />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Ubicación</label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Ej: Av. Libertador 1234, Buenos Aires"
              status={errors.location ? "error" : undefined}
            />
          )}
        />
        {errors.location ? (
          <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
        ) : null}
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

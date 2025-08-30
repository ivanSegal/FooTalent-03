"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import {
  inventoryItemSchema,
  type InventoryItemFormValues,
} from "@/features/inventory-items/schemas/inventoryItem.schema";
import type { InventoryItem } from "@/features/inventory-items/types/inventoryItem.types";
import { showAlert } from "@/utils/showAlert";
import { inventoryItemService } from "@/features/inventory-items/services/inventoryItem.service";

interface Props {
  current?: (InventoryItem & { id?: number }) | null;
  onSaved?: (v: InventoryItem) => void;
  onCancel?: () => void;
}

export default function InventoryItemForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: current ?? { name: "", description: "" },
  });

  React.useEffect(() => {
    if (current) {
      reset({ name: current.name, description: current.description });
    }
  }, [current, reset]);

  const onSubmit = async (values: InventoryItemFormValues) => {
    try {
      let saved: InventoryItem;
      if (current?.id) {
        saved = await inventoryItemService.update(current.id, values);
      } else {
        saved = await inventoryItemService.create(values);
      }
      await showAlert("Éxito", "Ítem de almacén guardado correctamente", "success");
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
              placeholder="Ej: Tornillos de acero M2"
              status={errors.name ? "error" : undefined}
            />
          )}
        />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">Descripción</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder="Detalle del ítem"
              rows={3}
              status={errors.description ? "error" : undefined}
            />
          )}
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-2">
        <Button onClick={onCancel} className="w-full">
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full">
          {isSubmitting
            ? "Guardando..."
            : current?.id
              ? "Modificar Item de Almacén"
              : "Agregar Item de Almacén"}
        </Button>
      </div>
    </form>
  );
}

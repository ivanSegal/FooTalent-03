"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, InputNumber } from "antd";
import { showAlert } from "@/utils/showAlert";
import {
  inventoryItemSchema,
  type InventoryItemFormValues,
} from "@/features/inventory/schemas/inventoryItem.schema";
import type { WarehouseItem } from "@/features/inventory/types/inventory.types";

interface Props {
  current?: (WarehouseItem & { id?: number }) | null;
  onSaved?: (item: WarehouseItem) => void;
  onCancel?: () => void;
  onSubmitForm?: (values: InventoryItemFormValues) => Promise<WarehouseItem>;
}

export default function InventoryItemForm({ current, onSaved, onCancel, onSubmitForm }: Props) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: current
      ? {
          name: current.name,
          description: current.description,
          stock: current.stock,
          stockMin: current.stockMin,
          warehouseName: current.warehouseName,
        }
      : { name: "", description: "", stock: 0, stockMin: 0, warehouseName: "" },
  });

  const onSubmit: (values: InventoryItemFormValues) => Promise<void> = async (values) => {
    if (!onSubmitForm) return;
    try {
      const saved = await onSubmitForm(values);
      onSaved?.(saved);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; fieldErrors?: Record<string, string> };
      const fieldErrors = apiErr?.fieldErrors as Record<string, string> | undefined;
      if (fieldErrors && typeof fieldErrors === "object") {
        for (const [key, message] of Object.entries(fieldErrors)) {
          const k = key as keyof InventoryItemFormValues;
          setError(k, { type: "server", message: String(message) });
        }
      }
      await showAlert(
        "Error al guardar",
        apiErr?.message || "No se pudo guardar el ítem de inventario",
        "error",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Nombre</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} status={errors.name ? "error" : ""} />}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Depósito</label>
          <Controller
            name="warehouseName"
            control={control}
            render={({ field }) => (
              <Input {...field} status={errors.warehouseName ? "error" : ""} />
            )}
          />
          {errors.warehouseName && (
            <span className="text-xs text-red-500">{errors.warehouseName.message}</span>
          )}
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm text-gray-700">Descripción</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                autoSize={{ minRows: 2 }}
                status={errors.description ? "error" : ""}
              />
            )}
          />
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description.message}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Stock</label>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "100%" }}
                status={errors.stock ? "error" : ""}
              />
            )}
          />
          {errors.stock && <span className="text-xs text-red-500">{errors.stock.message}</span>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Stock mínimo</label>
          <Controller
            name="stockMin"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "100%" }}
                status={errors.stockMin ? "error" : ""}
              />
            )}
          />
          {errors.stockMin && (
            <span className="text-xs text-red-500">{errors.stockMin.message}</span>
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

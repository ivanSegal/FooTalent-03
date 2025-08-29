"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputNumber, Select } from "antd";
import {
  inventoryStockSchema,
  type InventoryStockFormValues,
} from "@/features/inventory-items/schemas/inventoryStock.schema";
import type { InventoryStockRow } from "@/features/inventory-items/types/inventoryStock.types";
import { showAlert } from "@/utils/showAlert";
import { inventoryStockService } from "@/features/inventory-items/services/inventoryStock.service";
import { inventoryItemService } from "@/features/inventory-items/services/inventoryItem.service";
import { inventoryWarehouseService } from "@/features/inventory-items/services/inventoryWarehouse.service";

interface Props {
  current?: (InventoryStockRow & { id?: number }) | null;
  onSaved?: (v: InventoryStockRow) => void;
  onCancel?: () => void;
}

export default function InventoryStockForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InventoryStockFormValues>({
    resolver: zodResolver(inventoryStockSchema),
    defaultValues: current ?? { itemWarehouseId: 0, warehouseId: 0, stock: 0, stockMin: 0 },
  });

  const [items, setItems] = React.useState<{ label: string; value: number }[]>([]);
  const [warehouses, setWarehouses] = React.useState<{ label: string; value: number }[]>([]);

  React.useEffect(() => {
    void (async () => {
      try {
        const [itemsPage, whPage] = await Promise.all([
          inventoryItemService.list({ page: 0, size: 100 }),
          inventoryWarehouseService.list({ page: 0, size: 100 }),
        ]);
        setItems((itemsPage.content ?? []).map((i) => ({ label: i.name, value: i.id })));
        setWarehouses((whPage.content ?? []).map((w) => ({ label: w.name, value: w.id })));
      } catch {
        // ignorar
      }
    })();
  }, []);

  React.useEffect(() => {
    if (current) {
      reset({
        itemWarehouseId: current.itemWarehouseId,
        warehouseId: current.warehouseId,
        stock: current.stock,
        stockMin: current.stockMin,
      });
    }
  }, [current, reset]);

  const onSubmit = async (values: InventoryStockFormValues) => {
    try {
      let saved: InventoryStockRow;
      if (current?.id) {
        saved = await inventoryStockService.update(current.id, values);
      } else {
        saved = await inventoryStockService.create(values);
      }
      await showAlert("Éxito", "Stock guardado correctamente", "success");
      onSaved?.(saved);
      onCancel?.();
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-600">Ítem</label>
        <Controller
          name="itemWarehouseId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={items}
              placeholder="Selecciona un ítem"
              showSearch
              allowClear={false}
              status={errors.itemWarehouseId ? "error" : undefined}
              className="w-full"
            />
          )}
        />
        {errors.itemWarehouseId ? (
          <p className="mt-1 text-xs text-red-600">{errors.itemWarehouseId.message as string}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">Almacén</label>
        <Controller
          name="warehouseId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={warehouses}
              placeholder="Selecciona un almacén"
              showSearch
              allowClear={false}
              status={errors.warehouseId ? "error" : undefined}
              className="w-full"
            />
          )}
        />
        {errors.warehouseId ? (
          <p className="mt-1 text-xs text-red-600">{errors.warehouseId.message as string}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gray-600">Stock</label>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                placeholder="0"
                status={errors.stock ? "error" : undefined}
              />
            )}
          />
          {errors.stock ? (
            <p className="mt-1 text-xs text-red-600">{errors.stock.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Stock mínimo</label>
          <Controller
            name="stockMin"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                className="w-full"
                placeholder="0"
                status={errors.stockMin ? "error" : undefined}
              />
            )}
          />
          {errors.stockMin ? (
            <p className="mt-1 text-xs text-red-600">{errors.stockMin.message as string}</p>
          ) : null}
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

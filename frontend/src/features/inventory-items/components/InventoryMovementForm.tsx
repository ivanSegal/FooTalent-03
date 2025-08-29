"use client";

import React from "react";
import { Button, DatePicker, Input, InputNumber, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  inventoryMovementSchema,
  type InventoryMovementFormValues,
  MOVEMENT_TYPES,
} from "@/features/inventory-items/schemas/inventoryMovement.schema";
import type {
  InventoryMovement,
  InventoryMovementRequest,
} from "@/features/inventory-items/types/inventoryMovement.types";
import { inventoryMovementService } from "@/features/inventory-items/services/inventoryMovement.service";
import { inventoryItemService } from "@/features/inventory-items/services/inventoryItem.service";
import { inventoryWarehouseService } from "@/features/inventory-items/services/inventoryWarehouse.service";
import { showAlert } from "@/utils/showAlert";

interface Props {
  current?: InventoryMovement | null; // por si luego se soporta edición
  onSaved?: (v: InventoryMovement) => void;
  onCancel?: () => void;
}

export default function InventoryMovementForm({ current, onSaved, onCancel }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<InventoryMovementFormValues>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: current
      ? {
          warehouseId: current.warehouseId,
          movementType: current.movementType,
          date: current.date,
          reason: current.reason ?? undefined,
          responsibleId: current.responsibleId ?? undefined,
          movementDetails: (current.movementDetails ?? []).map((d) => ({
            itemWarehouseId: d.itemWarehouseId,
            quantity: d.quantity,
          })),
        }
      : {
          warehouseId: 0,
          movementType: "ENTRADA",
          date: dayjs().format("YYYY-MM-DD"),
          movementDetails: [],
        },
  });

  const [items, setItems] = React.useState<{ label: string; value: number }[]>([]);
  const [warehouses, setWarehouses] = React.useState<{ label: string; value: number }[]>([]);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [rows, setRows] = React.useState<Array<{ itemWarehouseId: number; quantity: number }>>([]);

  // Mantener movementDetails sincronizado con RHF para que Zod pueda validar y mostrar el error
  React.useEffect(() => {
    setValue("movementDetails", rows as InventoryMovementFormValues["movementDetails"], {
      shouldValidate: true,
    });
  }, [rows, setValue]);

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
      setDate(current.date ? dayjs(current.date) : null);
      setRows(
        (current.movementDetails ?? []).map((d) => ({
          itemWarehouseId: d.itemWarehouseId,
          quantity: d.quantity,
        })),
      );
    }
  }, [current]);

  const columns: ColumnsType<{ itemWarehouseId: number; quantity: number }> = [
    {
      title: "Ítem",
      dataIndex: "itemWarehouseId",
      key: "itemWarehouseId",
      render: (_: unknown, record, idx) => (
        <Select
          value={record.itemWarehouseId || undefined}
          options={items}
          onChange={(val) =>
            setRows((prev) =>
              prev.map((r, i) => (i === idx ? { ...r, itemWarehouseId: Number(val) } : r)),
            )
          }
          status={!record.itemWarehouseId || record.itemWarehouseId <= 0 ? "error" : undefined}
          showSearch
          className="w-full"
        />
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: unknown, record, idx) => (
        <InputNumber
          value={record.quantity}
          min={1}
          onChange={(val) =>
            setRows((prev) =>
              prev.map((r, i) => (i === idx ? { ...r, quantity: Number(val ?? 1) } : r)),
            )
          }
          status={!record.quantity || Number(record.quantity) < 1 ? "error" : undefined}
          className="w-full"
        />
      ),
      width: 140,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, _record, idx) => (
        <Button
          danger
          size="small"
          onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
        >
          Quitar
        </Button>
      ),
      width: 120,
    },
  ];

  const onSubmit = async (values: InventoryMovementFormValues) => {
    if (!date) {
      await showAlert("Fecha requerida", "Selecciona una fecha.", "warning");
      return;
    }
    if (!rows.length) {
      await showAlert("Items requeridos", "Agrega al menos un ítem.", "warning");
      return;
    }
    const hasInvalid = rows.some(
      (r) => !r.itemWarehouseId || r.itemWarehouseId <= 0 || !r.quantity || r.quantity < 1,
    );
    if (hasInvalid) {
      await showAlert(
        "Detalles incompletos",
        "Completa el ítem y una cantidad válida (>= 1) en todas las filas.",
        "warning",
      );
      return;
    }

    const payload: InventoryMovementRequest = {
      warehouseId: values.warehouseId,
      movementType: values.movementType,
      date: date.format("YYYY-MM-DD"),
      reason: values.reason || undefined,
      responsibleId: values.responsibleId ?? undefined,
      movementDetails: rows.map((r) => ({
        itemWarehouseId: r.itemWarehouseId,
        quantity: r.quantity,
      })),
    };

    try {
      const saved = await inventoryMovementService.create(payload);
      await showAlert("Éxito", "Movimiento guardado correctamente", "success");
      onSaved?.(saved);
      onCancel?.();
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo guardar", "error");
    }
  };
  console.log("error", errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
          <label className="mb-1 block text-sm text-gray-600">Tipo de movimiento</label>
          <Controller
            name="movementType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={MOVEMENT_TYPES.map((t) => ({ label: t, value: t }))}
                placeholder="Selecciona tipo"
                status={errors.movementType ? "error" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.movementType ? (
            <p className="mt-1 text-xs text-red-600">{errors.movementType.message as string}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Fecha</label>
          <DatePicker
            value={date}
            onChange={(d) => setDate(d)}
            className="w-full"
            placeholder="Selecciona una fecha"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">Motivo (opcional)</label>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value ?? undefined}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              placeholder="Motivo"
            />
          )}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Detalles</span>
          <Button
            size="small"
            onClick={() => setRows((prev) => [...prev, { itemWarehouseId: 0, quantity: 1 }])}
          >
            Agregar ítem
          </Button>
        </div>
        <div
          className={errors.movementDetails ? "rounded-md border border-red-500 p-2" : undefined}
        >
          <Table
            size="small"
            rowKey={(_, idx) => String(idx)}
            columns={columns}
            dataSource={rows}
            pagination={false}
          />
        </div>
        {errors.movementDetails ? (
          <p className="mt-1 text-xs text-red-600">
            {(errors.movementDetails as unknown as { message?: string })?.message as string}
          </p>
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

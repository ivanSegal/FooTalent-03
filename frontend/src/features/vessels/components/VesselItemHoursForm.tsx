"use client";

import React from "react";
import { Button, DatePicker, Input, InputNumber, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import type { VesselItem } from "@/features/vessels";
import { vesselItemHoursService } from "@/features/vessels/services/vesselItemHours.service";
import type {
  VesselItemHoursRequest,
  VesselItemHoursRow,
} from "@/features/vessels/types/vesselItemHours.types";
import { showAlert } from "@/utils/showAlert";

interface Props {
  vesselId: number;
  items: VesselItem[];
  onSaved: (updated: VesselItem[]) => void;
  onCancel: () => void;
  initial?: {
    id: number;
    date: string; // YYYY-MM-DD del backend
    comments?: string;
    items?: VesselItemHoursRow[];
  } | null;
}

export default function VesselItemHoursForm({
  vesselId,
  items,
  onSaved,
  onCancel,
  initial,
}: Props) {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [comments, setComments] = React.useState<string>("");
  const [hoursMap, setHoursMap] = React.useState<Record<number, number>>({});
  const [submitting, setSubmitting] = React.useState(false);

  // Prefill en modo edición
  React.useEffect(() => {
    if (initial && initial.id) {
      setDate(initial.date ? dayjs(initial.date) : null);
      setComments(initial.comments ?? "");
      const map: Record<number, number> = {};
      (initial.items ?? []).forEach((r) => {
        map[r.vesselItemId] = r.addedHours;
      });
      setHoursMap(map);
    } else {
      // reset en modo creación
      setDate(dayjs());
      setComments("");
      setHoursMap({});
    }
  }, [initial]);

  const columns: ColumnsType<VesselItem> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "H. acum.",
      dataIndex: "accumulatedHours",
      key: "accumulatedHours",
      width: 110,
      render: (v: number) => (typeof v === "number" ? v.toFixed(2) : (v ?? "—")),
    },
    {
      title: "Agregar horas",
      key: "addedHours",
      width: 140,
      render: (_: unknown, record) => (
        <InputNumber
          min={0}
          step={0.5}
          value={hoursMap[record.id] ?? 0}
          onChange={(val) => setHoursMap((prev) => ({ ...prev, [record.id]: Number(val ?? 0) }))}
          style={{ width: 120 }}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    const newRows = Object.entries(hoursMap)
      .map(([id, hours]) => ({ vesselItemId: Number(id), addedHours: Number(hours) }))
      .filter((r) => r.addedHours > 0);

    if (!newRows.length) {
      await showAlert("Sin cambios", "Ingresa horas para al menos un ítem.", "warning");
      return;
    }
    if (!date) {
      await showAlert("Fecha requerida", "Selecciona una fecha.", "warning");
      return;
    }

    const payload: VesselItemHoursRequest = {
      vesselId,
      date: date.format("DD-MM-YYYY"),
      comments,
      items: newRows,
    };

    setSubmitting(true);
    try {
      if (initial && initial.id) {
        // Modo edición: actualizar y ajustar acumulado por delta
        await vesselItemHoursService.update(initial.id, payload);
        const oldMap = new Map<number, number>(
          (initial.items ?? []).map((r) => [r.vesselItemId, r.addedHours]),
        );
        const newMap = new Map<number, number>(newRows.map((r) => [r.vesselItemId, r.addedHours]));
        const ids = new Set<number>([...Array.from(oldMap.keys()), ...Array.from(newMap.keys())]);
        const updated = items.map((it) => {
          if (!ids.has(it.id)) return it;
          const before = oldMap.get(it.id) ?? 0;
          const after = newMap.get(it.id) ?? 0;
          const delta = after - before;
          return { ...it, accumulatedHours: (it.accumulatedHours ?? 0) + delta };
        });
        onSaved(updated);
        await showAlert("Actualizado", "Reporte de horas actualizado.", "success");
      } else {
        // Modo creación
        await vesselItemHoursService.create(payload);
        const updated = items.map((it) => {
          const row = newRows.find((r) => r.vesselItemId === it.id);
          return row
            ? { ...it, accumulatedHours: (it.accumulatedHours ?? 0) + row.addedHours }
            : it;
        });
        onSaved(updated);
        await showAlert("Guardado", "Horas registradas correctamente.", "success");
      }
    } catch (e) {
      await showAlert("No se pudo guardar", (e as Error)?.message || "Intenta nuevamente", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700">Fecha</label>
          <DatePicker
            format="DD-MM-YYYY"
            value={date}
            onChange={(d) => setDate(d ?? null)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm text-gray-700">Comentarios</label>
          <Input.TextArea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Opcional"
            autoSize={{ minRows: 2 }}
          />
        </div>
      </div>

      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={items}
        pagination={false}
        scroll={{ y: 300 }}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button type="primary" onClick={handleSubmit} loading={submitting}>
          {initial && initial.id ? "Actualizar" : "Guardar horas"}
        </Button>
      </div>
    </div>
  );
}

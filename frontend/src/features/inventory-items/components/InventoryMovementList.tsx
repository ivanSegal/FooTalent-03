"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Modal, Select, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { inventoryMovementService } from "@/features/inventory-items/services/inventoryMovement.service";
import type { InventoryMovement } from "@/features/inventory-items/types/inventoryMovement.types";
import InventoryMovementForm from "@/features/inventory-items/components/InventoryMovementForm";
import { showAlert, showConfirmAlert } from "@/utils/showAlert";
import { inventoryWarehouseService } from "@/features/inventory-items/services/inventoryWarehouse.service";

export default function InventoryMovementList() {
  const [items, setItems] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<InventoryMovement | null>(null);

  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [warehouseId, setWarehouseId] = useState<number | undefined>(undefined);
  const [warehouses, setWarehouses] = useState<{ label: string; value: number }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryMovementService.list({
        page: 0,
        size: 100,
        fromDate: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
        toDate: toDate ? toDate.format("YYYY-MM-DD") : undefined,
        warehouseId,
      });
      setItems(res.content ?? []);
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo cargar", "error");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, warehouseId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void (async () => {
      try {
        const wh = await inventoryWarehouseService.list({ page: 0, size: 100 });
        setWarehouses((wh.content ?? []).map((w) => ({ label: w.name, value: w.id })));
      } catch {
        // ignore
      }
    })();
  }, []);

  const columns: ColumnsType<InventoryMovement> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Almacén", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Tipo", dataIndex: "movementType", key: "movementType", width: 120 },
    { title: "Fecha", dataIndex: "date", key: "date", width: 140 },
    { title: "Responsable", dataIndex: "responsibleName", key: "responsibleName" },
    { title: "Motivo", dataIndex: "reason", key: "reason" },
    {
      title: "Detalles",
      key: "details",
      render: (_: unknown, record) => (
        <Space wrap>
          {(record.movementDetails ?? []).map((d, idx) => (
            <Tag key={`${record.id}-${idx}`}>
              {d.itemWarehouseName} x {d.quantity}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 110,
      render: (_: unknown, record) => (
        <Space>
          <Tooltip title="Eliminar">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                const ok = await showConfirmAlert(
                  `Eliminar movimiento #${record.id}`,
                  `¿Seguro que deseas eliminar este movimiento?`,
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!ok) return;
                try {
                  await inventoryMovementService.remove(record.id);
                  setItems((prev) => prev.filter((x) => x.id !== record.id));
                  await showAlert(
                    "Eliminado",
                    `Se eliminó el movimiento #${record.id}.`,
                    "success",
                  );
                } catch (e) {
                  await showAlert(
                    "Error al eliminar",
                    (e as Error)?.message || "No se pudo eliminar",
                    "error",
                  );
                }
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <DatePicker placeholder="Desde" value={fromDate} onChange={(d) => setFromDate(d)} />
            <DatePicker placeholder="Hasta" value={toDate} onChange={(d) => setToDate(d)} />
            <Select
              allowClear
              placeholder="Filtrar por almacén"
              options={warehouses}
              value={warehouseId}
              onChange={(v) => setWarehouseId(v)}
              className="min-w-[220px]"
              showSearch
            />
            <Button onClick={() => void load()}>Buscar</Button>
          </div>
          <div className="flex justify-end">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialog(true)}>
              Nuevo movimiento
            </Button>
          </div>
        </div>
        <Table
          size="small"
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        open={dialog}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                {current ? `Modificar movimiento #${current.id}` : "Crear movimiento"}
              </h2>
            </div>
          </div>
        }
        onCancel={() => {
          setCurrent(null);
          setDialog(false);
        }}
        footer={null}
      >
        <InventoryMovementForm
          current={current}
          onSaved={(saved) => {
            setItems((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev];
            });
            setCurrent(null);
            setDialog(false);
          }}
          onCancel={() => {
            setCurrent(null);
            setDialog(false);
          }}
        />
      </Modal>
    </div>
  );
}

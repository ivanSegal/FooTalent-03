"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { inventoryStockService } from "@/features/inventory-items/services/inventoryStock.service";
import type { InventoryStockRow } from "@/features/inventory-items/types/inventoryStock.types";
import InventoryStockForm from "@/features/inventory-items/components/InventoryStockForm";
import { showAlert, showConfirmAlert } from "@/utils/showAlert";

export default function InventoryStockList() {
  const [items, setItems] = useState<InventoryStockRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<InventoryStockRow | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryStockService.list({ page: 0, size: 100 });
      setItems(res.content ?? []);
    } catch (e) {
      await showAlert("Error", (e as Error)?.message || "No se pudo cargar", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return items;
    return items.filter((i) => {
      return (
        i.itemWarehouseName.toLowerCase().includes(term) ||
        i.warehouseName.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const columns: ColumnsType<InventoryStockRow> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Ítem", dataIndex: "itemWarehouseName", key: "itemWarehouseName" },
    { title: "Almacén", dataIndex: "warehouseName", key: "warehouseName" },
    {
      title: "Stock",
      key: "stock",
      render: (_: unknown, record) => (
        <Tag color={record.stock <= record.stockMin ? "red" : "blue"}>{record.stock}</Tag>
      ),
    },
    { title: "Stock mínimo", dataIndex: "stockMin", key: "stockMin", width: 140 },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      render: (_: unknown, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrent(record);
                setDialog(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                const confirmed = await showConfirmAlert(
                  `Eliminar stock #${record.id}`,
                  `¿Seguro que deseas eliminar este registro?\n`,
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!confirmed) return;
                try {
                  await inventoryStockService.remove(record.id);
                  setItems((prev) => prev.filter((x) => x.id !== record.id));
                  await showAlert("Eliminado", `Se eliminó el stock #${record.id}.`, "success");
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
            <Input.Search
              allowClear
              placeholder="Buscar ítem o almacén..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialog(true)}>
              Nuevo stock
            </Button>
          </div>
        </div>
        <Table
          size="small"
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
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
                {current ? `Modificar stock #${current.id}` : "Crear stock"}
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
        <InventoryStockForm
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

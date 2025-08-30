"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { inventoryItemService } from "@/features/inventory-items/services/inventoryItem.service";
import type { InventoryItem } from "@/features/inventory-items/types/inventoryItem.types";
import InventoryItemForm from "@/features/inventory-items/components/InventoryItemForm";
import { showAlert, showConfirmAlert } from "@/utils/showAlert";

export default function InventoryItemsList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryItemService.list({ page: 0, size: 100 });
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
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        (i.stocks || []).some((s) => s.warehouseName.toLowerCase().includes(term))
      );
    });
  }, [items, search]);

  const columns: ColumnsType<InventoryItem> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Stocks",
      key: "stocks",
      render: (_: unknown, record) => (
        <Space wrap>
          {(record.stocks ?? []).length ? (
            record.stocks.map((s) => (
              <Tag key={s.stockId} color={s.stock <= s.stockMin ? "red" : "blue"}>
                {s.warehouseName}: {s.stock}
              </Tag>
            ))
          ) : (
            <span className="text-gray-500">Sin stock</span>
          )}
        </Space>
      ),
    },
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
                  `Eliminar ítem #${record.id}`,
                  `¿Seguro que deseas eliminar "${record.name}"? Esta acción no se puede deshacer.\n`,
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!confirmed) return;
                try {
                  await inventoryItemService.remove(record.id);
                  setItems((prev) => prev.filter((x) => x.id !== record.id));
                  await showAlert("Eliminado", `Se eliminó el ítem #${record.id}.`, "success");
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
              placeholder="Buscar nombre, descripción, depósito..."
              className="max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialog(true)}>
              Nuevo ítem
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
                {current ? `Modificar ítem #${current.id} – ${current.name}` : "Crear ítem"}
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
        <InventoryItemForm
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

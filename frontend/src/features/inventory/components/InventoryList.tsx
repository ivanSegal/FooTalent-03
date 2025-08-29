"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { inventoryService } from "@/features/inventory/services/inventory.service";
import type { WarehouseItem } from "@/features/inventory/types/inventory.types";
import { showAlert } from "@/utils/showAlert";
import InventoryItemForm from "@/features/inventory/components/InventoryItemForm";

export default function InventoryList() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<WarehouseItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryService.list({ page: 0, size: 20, sort: tableSort });
      setItems(res.content ?? []);
    } catch (e) {
      await showAlert(
        "Error al cargar",
        (e as Error)?.message || "No se pudo cargar el inventario",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [tableSort]);

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
        i.warehouseName.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const handleTableChange: TableProps<WarehouseItem>["onChange"] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    if (Array.isArray(sorter)) {
      const s = sorter[0];
      let order: "asc" | "desc" | undefined;
      if (s?.order === "ascend") order = "asc";
      else if (s?.order === "descend") order = "desc";
      const field = (s?.field as string) || undefined;
      setTableSort(order && field ? `${field},${order}` : undefined);
    } else {
      let order: "asc" | "desc" | undefined;
      if (sorter.order === "ascend") order = "asc";
      else if (sorter.order === "descend") order = "desc";
      const field = (sorter.field as string) || undefined;
      setTableSort(order && field ? `${field},${order}` : undefined);
    }
  };

  const columns: ColumnsType<WarehouseItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("id,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
      render: (v: WarehouseItem["id"]) => (v ?? "—") as React.ReactNode,
    },
    { title: "Nombre", dataIndex: "name", key: "name", sorter: true },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Stock", dataIndex: "stock", key: "stock", width: 100, sorter: true },
    { title: "Stock mínimo", dataIndex: "stockMin", key: "stockMin", width: 120, sorter: true },
    { title: "Depósito", dataIndex: "warehouseName", key: "warehouseName" },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small">
          <Tooltip title="Editar ítem">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrent(record);
                setDialog(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={async () => {
              try {
                await inventoryService.remove(record.id);
                setItems((prev) => prev.filter((x) => x.id !== record.id));
              } catch (e) {
                await showAlert(
                  "Error al eliminar",
                  (e as Error)?.message || "No se pudo eliminar",
                  "error",
                );
              }
            }}
          >
            <Tooltip title="Eliminar ítem">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
              <p className="mt-1 text-sm text-gray-600">Listado de ítems de almacén.</p>
            </div>
          </header>

          <section className="space-y-4">
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <Input.Search
                    allowClear
                    placeholder="Buscar por nombre, descripción o depósito"
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip title="Recargar">
                    <Button size="small" onClick={() => void load()}>
                      Actualizar
                    </Button>
                  </Tooltip>
                  {/* Espacio para futuras acciones (crear item, exportar, etc) */}
                  <Button
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setCurrent(null);
                      setDialog(true);
                    }}
                  >
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
                onChange={handleTableChange}
                pagination={{ pageSize: 20, showSizeChanger: false }}
                scroll={{ x: "max-content" }}
              />
            </div>
          </section>
        </div>
      </main>

      <Modal
        open={dialog}
        title={current ? `Editar ítem #${current.id}` : "Nuevo ítem"}
        onCancel={() => {
          setDialog(false);
          setCurrent(null);
        }}
        footer={null}
      >
        <InventoryItemForm
          current={current}
          onSubmitForm={async (values) => {
            if (current?.id) {
              await inventoryService.update(current.id, values);
              const merged = { ...current, ...values } as WarehouseItem;
              setItems((prev) => prev.map((x) => (x.id === current.id ? merged : x)));
              return merged;
            }
            const saved = await inventoryService.create(values);
            const created = saved as unknown as WarehouseItem;
            setItems((prev) => [created, ...prev]);
            return created;
          }}
          onSaved={() => {
            setDialog(false);
            setCurrent(null);
          }}
          onCancel={() => {
            setDialog(false);
            setCurrent(null);
          }}
        />
      </Modal>
    </>
  );
}

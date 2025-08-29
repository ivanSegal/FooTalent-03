"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Table, Tooltip, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm, Space } from "antd";
import inventoryWarehousesService from "@/features/inventory/services/inventoryWarehouses.service";
import type { Warehouse } from "@/features/inventory/types/inventoryWarehouses.types";
import InventoryWarehouseForm from "@/features/inventory/components/InventoryWarehouseForm";

export default function InventoryWarehouseList() {
  const [items, setItems] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<Warehouse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryWarehousesService.list({ page: 0, size: 20, sort: tableSort });
      setItems(res.content ?? []);
    } catch (e) {
      message.error((e as Error)?.message || "No se pudo cargar depósitos");
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
      return i.name.toLowerCase().includes(term) || i.location.toLowerCase().includes(term);
    });
  }, [items, search]);

  const handleTableChange: TableProps<Warehouse>["onChange"] = (_pagination, _filters, sorter) => {
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

  const columns: ColumnsType<Warehouse> = [
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
      render: (v: Warehouse["id"]) => (v ?? "—") as React.ReactNode,
    },
    { title: "Nombre", dataIndex: "name", key: "name", sorter: true },
    { title: "Ubicación", dataIndex: "location", key: "location", sorter: true },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small">
          <Tooltip title="Editar depósito">
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
                await inventoryWarehousesService.remove(record.id);
                setItems((prev) => prev.filter((x) => x.id !== record.id));
              } catch (e) {
                message.error((e as Error)?.message || "No se pudo eliminar");
              }
            }}
          >
            <Tooltip title="Eliminar depósito">
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
              <h1 className="text-3xl font-bold text-gray-900">Depósitos</h1>
              <p className="mt-1 text-sm text-gray-600">Listado de depósitos (warehouses).</p>
            </div>
          </header>

          <section className="space-y-4">
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <Input.Search
                    allowClear
                    placeholder="Buscar por nombre o ubicación"
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
                  <Button
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setCurrent(null);
                      setDialog(true);
                    }}
                  >
                    Nuevo depósito
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
        title={current ? `Editar depósito #${current.id}` : "Nuevo depósito"}
        onCancel={() => {
          setDialog(false);
          setCurrent(null);
        }}
        footer={null}
      >
        <InventoryWarehouseForm
          current={current}
          onSaved={(saved) => {
            if (current?.id) {
              setItems((prev) => prev.map((x) => (x.id === current.id ? saved : x)));
            } else {
              setItems((prev) => [saved, ...prev]);
            }
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

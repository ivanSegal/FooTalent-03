"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { vasselsService, type Vassel } from "@/features/vassels";
import VasselsForm from "@/features/vassels/components/VasselsForm";
import { showAlert } from "@/utils/showAlert";
import Link from "next/link";
import { vasselItemService } from "@/features/vassel-item";
import type { VasselItem } from "@/features/vassel-item";

export default function VasselsList() {
  const [items, setItems] = useState<Vassel[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<Vassel | null>(null);
  const [search, setSearch] = useState("");
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const [itemsByVassel, setItemsByVassel] = useState<
    Record<number, { loading: boolean; data: VasselItem[] }>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vasselsService.list({ page: 0, size: 100, sort: tableSort });
      setItems(res.content ?? []);
    } catch (e) {
      await showAlert(
        "Error al cargar",
        (e as Error)?.message || "No se pudo cargar la lista de embarcaciones",
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
        i.registrationNumber.toLowerCase().includes(term) ||
        i.flagState.toLowerCase().includes(term) ||
        i.portOfRegistry.toLowerCase().includes(term) ||
        i.rif.toLowerCase().includes(term) ||
        i.serviceType.toLowerCase().includes(term) ||
        i.constructionMaterial.toLowerCase().includes(term) ||
        i.sternType.toLowerCase().includes(term) ||
        i.fuelType.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const handleTableChange: TableProps<Vassel>["onChange"] = (_pagination, _filters, sorter) => {
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

  const columns: ColumnsType<Vassel> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("id,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
      render: (v: Vassel["id"]) => (v ?? "—") as React.ReactNode,
    },
    { title: "Nombre", dataIndex: "name", key: "name", sorter: true },
    { title: "Matrícula", dataIndex: "registrationNumber", key: "registrationNumber" },
    { title: "ISMM", dataIndex: "ismm", key: "ismm" },
    { title: "Bandera", dataIndex: "flagState", key: "flagState" },
    { title: "Señal", dataIndex: "callSign", key: "callSign" },
    { title: "Puerto", dataIndex: "portOfRegistry", key: "portOfRegistry" },
    { title: "RIF", dataIndex: "rif", key: "rif" },
    { title: "Servicio", dataIndex: "serviceType", key: "serviceType" },
    { title: "Material", dataIndex: "constructionMaterial", key: "constructionMaterial" },
    { title: "Popa", dataIndex: "sternType", key: "sternType" },
    { title: "Combustible", dataIndex: "fuelType", key: "fuelType" },
    { title: "Horas", dataIndex: "navigationHours", key: "navigationHours", width: 100 },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Ver ítems">
            <Link href={`/vassels/${record.id}/items`}>
              <Button size="small" type="text">
                Ítems
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Editar">
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
                await vasselsService.remove(record.id);
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
            <Tooltip title="Eliminar">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<VasselItem> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Tipo", dataIndex: "controlType", key: "controlType" },
    { title: "H. acum.", dataIndex: "accumulatedHours", key: "accumulatedHours", width: 100 },
    { title: "Vida útil", dataIndex: "usefulLifeHours", key: "usefulLifeHours", width: 100 },
    { title: "Alerta", dataIndex: "alertHours", key: "alertHours", width: 90 },
    { title: "Material", dataIndex: "materialType", key: "materialType" },
  ];

  const expandedRowRender = (record: Vassel) => {
    const entry = itemsByVassel[record.id];
    return (
      <div className="p-2">
        <Table
          size="small"
          rowKey="id"
          columns={itemColumns}
          dataSource={entry?.data ?? []}
          loading={entry?.loading}
          pagination={false}
        />
      </div>
    );
  };

  const handleExpand: TableProps<Vassel>["onExpand"] = async (expanded, record) => {
    if (expanded) {
      setItemsByVassel((prev) => ({
        ...prev,
        [record.id]: { loading: true, data: prev[record.id]?.data ?? [] },
      }));
      try {
        const res = await vasselItemService.list({ vasselId: record.id, page: 0, size: 50 });
        setItemsByVassel((prev) => ({
          ...prev,
          [record.id]: { loading: false, data: res.content ?? [] },
        }));
      } catch {
        setItemsByVassel((prev) => ({
          ...prev,
          [record.id]: { loading: false, data: prev[record.id]?.data ?? [] },
        }));
      }
    }
  };

  return (
    <main className="ml-16 min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Embarcaciones</h1>
            <p className="mt-1 text-sm text-gray-600">Listado y gestión de embarcaciones.</p>
          </div>
        </header>
        <section className="space-y-4">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <Input.Search
                  allowClear
                  placeholder="Buscar nombre, matrícula, bandera, puerto, RIF, servicio..."
                  className="max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialog(true)}>
                  Nueva embarcación
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
              pagination={{ pageSize: 10, showSizeChanger: false }}
              expandable={{ expandedRowRender, onExpand: handleExpand }}
            />
          </div>
        </section>
      </div>
      <Modal
        open={dialog}
        title={current ? `Editar embarcación #${current.id}` : "Nueva embarcación"}
        onCancel={() => {
          setCurrent(null);
          setDialog(false);
        }}
        footer={null}
        destroyOnClose
      >
        <VasselsForm
          current={current}
          onSaved={(saved) => {
            setItems((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev];
            });
          }}
          onCancel={() => {
            setCurrent(null);
            setDialog(false);
          }}
        />
      </Modal>
    </main>
  );
}

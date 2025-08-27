"use client";

import React from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { vasselItemService } from "@/features/vassel-item/services/vasselItem.service";
import type { VasselItem } from "@/features/vassel-item/types/vasselItem.types";
import VasselItemForm from "@/features/vassel-item/components/VasselItemForm";
import { showAlert } from "@/utils/showAlert";

interface Props {
  vasselId: number;
}

export default function VasselItemList({ vasselId }: Props) {
  const [items, setItems] = React.useState<VasselItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);
  const [current, setCurrent] = React.useState<VasselItem | null>(null);
  const [search, setSearch] = React.useState("");
  const [tableSort, setTableSort] = React.useState<string | undefined>("id,desc");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await vasselItemService.list({ page: 0, size: 100, sort: tableSort, vasselId });
      setItems(res.content ?? []);
    } catch (e) {
      await showAlert(
        "Error al cargar",
        (e as Error)?.message || "No se pudo cargar la lista de items",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [tableSort, vasselId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return items;
    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        i.controlType.toLowerCase().includes(term) ||
        i.materialType.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const handleTableChange: TableProps<VasselItem>["onChange"] = (_pagination, _filters, sorter) => {
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

  const columns: ColumnsType<VasselItem> = [
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
      render: (v: VasselItem["id"]) => (v ?? "—") as React.ReactNode,
    },
    { title: "Nombre", dataIndex: "name", key: "name", sorter: true },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Tipo de control",
      dataIndex: "controlType",
      key: "controlType",
      render: (v: VasselItem["controlType"]) => <Tag>{v}</Tag>,
    },
    { title: "H. acum.", dataIndex: "accumulatedHours", key: "accumulatedHours", width: 100 },
    { title: "Vida útil", dataIndex: "usefulLifeHours", key: "usefulLifeHours", width: 100 },
    { title: "Alerta", dataIndex: "alertHours", key: "alertHours", width: 90 },
    {
      title: "Material",
      dataIndex: "materialType",
      key: "materialType",
      render: (v: VasselItem["materialType"]) => <Tag>{v}</Tag>,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
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
                await vasselItemService.remove(record.id);
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

  return (
    <main>
      <div className="mx-auto">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <Input.Search
                  allowClear
                  placeholder="Buscar nombre, descripción, tipo..."
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
              onChange={handleTableChange}
              pagination={{ pageSize: 10, showSizeChanger: false }}
            />
          </div>
        </section>
      </div>
      <Modal
        open={dialog}
        title={current ? `Editar ítem #${current.id}` : "Nuevo ítem"}
        onCancel={() => {
          setCurrent(null);
          setDialog(false);
        }}
        footer={null}
      >
        <VasselItemForm
          vasselId={vasselId}
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

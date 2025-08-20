"use client";
import React, { useState, useMemo } from "react";
import { Table, Tag, Button, Space, Popconfirm, Input, Select, Tooltip, DatePicker } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs"; // use only Dayjs type
import type { MantenimientoItem } from "@/features/mantenimiento";

interface Props {
  items: MantenimientoItem[];
  onSelect?: (item: MantenimientoItem) => void; // legado (click fila)
  onView?: (item: MantenimientoItem) => void;
  onEdit?: (item: MantenimientoItem) => void;
  onDelete?: (item: MantenimientoItem) => void;
  onCreate?: () => void; // nuevo
}

const estadoColor: Record<string, string> = {
  pendiente: "orange",
  en_progreso: "blue",
  completado: "green",
};

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : "-");
const formatCurrency = (v?: number) =>
  typeof v === "number"
    ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(v)
    : "-";

export const MantenimientoList: React.FC<Props> = ({
  items,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string | undefined>(undefined);
  const [fechaProgRange, setFechaProgRange] = useState<[Dayjs, Dayjs] | null>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((i) => {
      const matchesSearch =
        !term ||
        i.tarea.toLowerCase().includes(term) ||
        i.embarcacion.toLowerCase().includes(term) ||
        (i.responsable?.toLowerCase().includes(term) ?? false);
      const matchesEstado = !estadoFilter || i.estado === estadoFilter;
      const matchesFechaProg =
        !fechaProgRange || !i.fechaProgramada
          ? !fechaProgRange // si hay rango pero el item no tiene fecha -> excluye
          : (() => {
              const d = new Date(i.fechaProgramada as string).getTime();
              const start = fechaProgRange[0].startOf("day").valueOf();
              const end = fechaProgRange[1].endOf("day").valueOf();
              return d >= start && d <= end;
            })();
      return matchesSearch && matchesEstado && matchesFechaProg;
    });
  }, [items, search, estadoFilter, fechaProgRange]);

  const columns: ColumnsType<MantenimientoItem> = [
    {
      title: "Tarea",
      dataIndex: "tarea",
      key: "tarea",
      render: (text: string, record: MantenimientoItem) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{text}</span>
          <span className="text-xs text-gray-500">Embarcación: {record.embarcacion}</span>
        </div>
      ),
    },
    {
      title: "Responsable",
      dataIndex: "responsable",
      key: "responsable",
      render: (v: MantenimientoItem["responsable"]) =>
        v || <span className="text-gray-400">—</span>,
      responsive: ["md"],
    },
    {
      title: "Programado",
      dataIndex: "fechaProgramada",
      key: "fechaProgramada",
      render: (v: MantenimientoItem["fechaProgramada"]) => formatDate(v),
      responsive: ["lg"],
    },
    {
      title: "Real",
      dataIndex: "fechaReal",
      key: "fechaReal",
      render: (v: MantenimientoItem["fechaReal"]) => formatDate(v),
      responsive: ["lg"],
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      filters: [
        { text: "Pendiente", value: "pendiente" },
        { text: "En progreso", value: "en_progreso" },
        { text: "Completado", value: "completado" },
      ],
      filteredValue: estadoFilter ? [estadoFilter] : null,
      onFilter: (value: unknown, record: MantenimientoItem) => record.estado === value,
      render: (estado: MantenimientoItem["estado"]) =>
        estado ? (
          <Tag color={estadoColor[estado]} className="rounded px-2 py-0.5 text-xs font-medium">
            {estado.replace(/_/g, " ")}
          </Tag>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Costo",
      dataIndex: "costo",
      key: "costo",
      align: "right" as const,
      render: (v: MantenimientoItem["costo"]) => (
        <span className="font-medium">{formatCurrency(v)}</span>
      ),
      responsive: ["md"],
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record: MantenimientoItem) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Ver">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView?.(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            description="Esta acción no se puede deshacer"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() => onDelete?.(record)}
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
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Input.Search
            allowClear
            placeholder="Buscar tarea, embarcación o responsable"
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            className="w-44"
            placeholder={
              <span className="flex items-center gap-1">
                <FilterOutlined /> Estado
              </span>
            }
            value={estadoFilter}
            onChange={(v) => setEstadoFilter(v)}
            options={[
              { label: "Pendiente", value: "pendiente" },
              { label: "En progreso", value: "en_progreso" },
              { label: "Completado", value: "completado" },
            ]}
          />
          <DatePicker.RangePicker
            allowClear
            className="w-[260px]"
            placeholder={["Desde (Prog)", "Hasta (Prog)"]}
            onChange={(values) =>
              setFechaProgRange(values && values[0] && values[1] ? [values[0], values[1]] : null)
            }
            value={fechaProgRange || undefined}
          />
        </div>
        <div className="flex justify-end">
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Nuevo mantenimiento
          </Button>
        </div>
      </div>
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        onRow={
          onSelect
            ? (record) => ({
                onClick: () => onSelect?.(record),
                className: "cursor-pointer hover:bg-gray-50",
              })
            : undefined
        }
      />
    </div>
  );
};

export default MantenimientoList;

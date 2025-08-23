"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  Input,
  Select,
  Tooltip,
  DatePicker,
  Skeleton,
  Modal,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  MaintenanceForm,
  MantenimientoForm,
  mantenimientoService,
  type MaintenanceListItem,
} from "@/features/maintenance";
import { NormalizedApiError } from "@/types/api";
import { showAlert } from "@/utils/showAlert";

dayjs.extend(customParseFormat);

const statusColor: Record<string, string> = {
  SOLICITADO: "orange",
  PROGRAMADO: "gold",
  EN_PROGRESO: "blue",
  FINALIZADO: "green",
};

const displayDate = (d?: string | null) => (d ? d : "-");

export const MaintenanceList = () => {
  const [maintenanceLists, setMaintenanceLists] = useState<MaintenanceListItem[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceListItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [fechaProgRange, setFechaProgRange] = useState<[Dayjs, Dayjs] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mantenimientoService.list({ page: 0, size: 50 });
      setMaintenanceLists(res.content);
    } catch (e) {
      const err = e as NormalizedApiError;
      await showAlert(
        "Error al cargar",
        err?.message || "No se pudo cargar la lista de mantenimientos",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return maintenanceLists.filter((i) => {
      const matchesSearch =
        !term ||
        (i.maintenanceReason || i.maintenanceType || "").toLowerCase().includes(term) ||
        i.vesselName.toLowerCase().includes(term) ||
        (i.maintenanceManager || "").toLowerCase().includes(term);
      const matchesStatus = !statusFilter || i.status === statusFilter;
      const matchesFechaProg =
        !fechaProgRange || !i.scheduledAt
          ? !fechaProgRange
          : (() => {
              const d = dayjs(i.scheduledAt, "DD-MM-YYYY", true).valueOf();
              const start = fechaProgRange[0].startOf("day").valueOf();
              const end = fechaProgRange[1].endOf("day").valueOf();
              return d >= start && d <= end;
            })();
      return matchesSearch && matchesStatus && matchesFechaProg;
    });
  }, [maintenanceLists, search, statusFilter, fechaProgRange]);

  const columns: ColumnsType<MaintenanceListItem> = [
    {
      title: "Tarea",
      dataIndex: "maintenanceReason",
      key: "maintenanceReason",
      render: (_: unknown, record: MaintenanceListItem) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {record.maintenanceReason || record.maintenanceType}
          </span>
          <span className="text-xs text-gray-500">Embarcación: {record.vesselName}</span>
        </div>
      ),
    },
    {
      title: "Responsable",
      dataIndex: "maintenanceManager",
      key: "maintenanceManager",
      render: (v: MaintenanceListItem["maintenanceManager"]) =>
        v || <span className="text-gray-400">—</span>,
      responsive: ["md"],
    },
    {
      title: "Emitido",
      dataIndex: "issuedAt",
      key: "issuedAt",
      render: (v: MaintenanceListItem["issuedAt"]) => displayDate(v),
      responsive: ["lg"],
    },
    {
      title: "Programado",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (v: MaintenanceListItem["scheduledAt"]) => displayDate(v),
      responsive: ["lg"],
    },
    {
      title: "Inicio",
      dataIndex: "startedAt",
      key: "startedAt",
      render: (v: MaintenanceListItem["startedAt"]) => displayDate(v),
      responsive: ["lg"],
    },
    {
      title: "Fin",
      dataIndex: "finishedAt",
      key: "finishedAt",
      render: (v: MaintenanceListItem["finishedAt"]) => displayDate(v),
      responsive: ["lg"],
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Solicitado", value: "SOLICITADO" },
        { text: "Programado", value: "PROGRAMADO" },
        { text: "En progreso", value: "EN_PROGRESO" },
        { text: "Finalizado", value: "FINALIZADO" },
      ],
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: unknown, record: MaintenanceListItem) => record.status === value,
      render: (status: MaintenanceListItem["status"]) => (
        <Tag
          color={statusColor[status] || "default"}
          className="rounded px-2 py-0.5 text-xs font-medium"
        >
          {status.replace(/_/g, " ")}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record: MaintenanceListItem) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Ver">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined />}
              // onClick={() => onView?.(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              // onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            description="Esta acción no se puede deshacer"
            okText="Eliminar"
            cancelText="Cancelar"
            // onConfirm={() => onDelete?.(record)}
          >
            <Tooltip title="Eliminar">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header skeleton */}
          <Skeleton active title={{ width: 260 }} paragraph={false} />
          {/* Card/list skeleton */}
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Skeleton.Input active style={{ width: 260 }} />
              <Skeleton.Button active />
            </div>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mantenimientos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestión y registro de órdenes de mantenimiento preventivo y correctidvo.
            </p>
          </div>
        </header>
        <section className="space-y-4">
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
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v)}
                  options={[
                    { label: "Solicitado", value: "SOLICITADO" },
                    { label: "Programado", value: "PROGRAMADO" },
                    { label: "En progreso", value: "EN_PROGRESO" },
                    { label: "Finalizado", value: "FINALIZADO" },
                  ]}
                />
                <DatePicker.RangePicker
                  allowClear
                  className="w-[260px]"
                  placeholder={["Desde (Prog)", "Hasta (Prog)"]}
                  onChange={(values) =>
                    setFechaProgRange(
                      values && values[0] && values[1] ? [values[0], values[1]] : null,
                    )
                  }
                  value={fechaProgRange || undefined}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  // onClick={onCreate}
                >
                  Nueva orden
                </Button>
              </div>
            </div>
            <Table
              size="small"
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              // onRow={
              //   onSelect
              //     ? (record) => ({
              //         onClick: () => onSelect?.(record),
              //         className: "cursor-pointer hover:bg-gray-50",
              //       })
              //     : undefined
              // }
            />
          </div>
        </section>
      </div>
      <Modal
        open={!!maintenanceList}
        title={
          maintenanceList?.id
            ? `Editar #${maintenanceList.id}`
            : maintenanceList
              ? "Nueva orden"
              : ""
        }
        onCancel={handleCancel}
        footer={null}
      >
        {maintenanceList && (
          <MaintenanceForm
            maintenanceLists={maintenanceLists}
            setMaintenanceLists={setMaintenanceLists}
            maintenanceList={maintenanceList}
            setMaintenanceList={setMaintenanceList}
          />
        )}
      </Modal>
    </main>
  );
};

export default MaintenanceList;

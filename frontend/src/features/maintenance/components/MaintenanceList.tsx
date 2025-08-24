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
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  MaintenanceForm,
  maintenanceService,
  MaintenanceTemplate,
  type MaintenanceListItem,
} from "@/features/maintenance";
import type { TableProps } from "antd";
import { NormalizedApiError } from "@/types/api";
import { showAlert } from "@/utils/showAlert";
import PDFGenerator from "@/components/pdf/PDFGenerator";

dayjs.extend(customParseFormat);

// Estados soportados por el backend y sus colores en Tag
const statusColor: Record<string, string> = {
  SOLICITADO: "orange",
  EN_PROCESO: "blue",
  ESPERANDO_INSUMOS: "gold",
  FINALIZADO: "green",
  ANULADO: "red",
  RECHAZADO: "red",
};

const displayDate = (d?: string | null) => (d ? d : "-");

export const MaintenanceList = () => {
  const [maintenanceLists, setMaintenanceLists] = useState<MaintenanceListItem[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceListItem | null>(null);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  // Nuevo filtro por tipo de mantenimiento
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [fechaProgRange, setFechaProgRange] = useState<[Dayjs, Dayjs] | null>(null);
  // Ordenamiento remoto (por defecto id desc)
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await maintenanceService.list({ page: 0, size: 50, sort: tableSort });
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
  }, [tableSort]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleTableChange: TableProps<MaintenanceListItem>["onChange"] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    if (Array.isArray(sorter)) {
      // En este caso usamos solo el primero si existiera (no activamos multi-sort visualmente)
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
  const hideMaintenanceFormDialog = () => {
    setMaintenanceList(null); // Limpia el estado del mantenimiento seleccionado
    setMaintenanceDialog(false);
  };
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return maintenanceLists.filter((i) => {
      const matchesSearch =
        !term ||
        (i.maintenanceReason || i.maintenanceType || "").toLowerCase().includes(term) ||
        i.vesselName.toLowerCase().includes(term) ||
        (i.maintenanceManager || "").toLowerCase().includes(term);
      const matchesStatus = !statusFilter || i.status === statusFilter;
      const matchesType = !typeFilter || i.maintenanceType === typeFilter;
      // Filtra por rango si CUALQUIERA de las fechas del registro cae en el rango
      const matchesFechaProg = (() => {
        if (!fechaProgRange) return true;
        const start = fechaProgRange[0].startOf("day").valueOf();
        const end = fechaProgRange[1].endOf("day").valueOf();
        const toTs = (s?: string | null) =>
          s ? dayjs(s, "DD-MM-YYYY", true).valueOf() : undefined;
        const dates = [
          toTs(i.issuedAt),
          toTs(i.scheduledAt),
          toTs(i.startedAt),
          toTs(i.finishedAt),
        ].filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
        if (dates.length === 0) return false;
        return dates.some((d) => d >= start && d <= end);
      })();
      return matchesSearch && matchesStatus && matchesType && matchesFechaProg;
    });
  }, [maintenanceLists, search, statusFilter, typeFilter, fechaProgRange]);

  const columns: ColumnsType<MaintenanceListItem> = [
    // Identificador de la orden
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("id,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
      render: (v: MaintenanceListItem["id"]) => (v ?? "—") as React.ReactNode,
    },
    // Estado primero para rápida lectura
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      ellipsis: true,

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
    // Tipo de mantenimiento
    {
      title: "Tipo",
      dataIndex: "maintenanceType",
      key: "maintenanceType",
      render: (v: MaintenanceListItem["maintenanceType"]) =>
        v ? v.charAt(0) + v.slice(1).toLowerCase() : <span className="text-gray-400">—</span>,
    },
    // Motivo de mantenimiento
    {
      title: "Motivo",
      dataIndex: "maintenanceReason",
      key: "maintenanceReason",
      ellipsis: true,
      render: (v: MaintenanceListItem["maintenanceReason"]) =>
        v ? (
          <Tooltip title={v}>
            <span className="font-medium text-gray-800">{v}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    // Embarcación
    {
      title: "Embarcación",
      dataIndex: "vesselName",
      key: "vesselName",
      render: (v: MaintenanceListItem["vesselName"]) => v,
    },
    // Responsable
    {
      title: "Responsable",
      dataIndex: "maintenanceManager",
      key: "maintenanceManager",
      ellipsis: true,
      render: (v: MaintenanceListItem["maintenanceManager"]) =>
        v ? <>{v}</> : <span className="text-gray-400">—</span>,
      responsive: ["md"],
    },
    // Fechas (solo en pantallas grandes)
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
    // Acciones al final
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record: MaintenanceListItem) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Imprimir / Vista previa">
            <PDFGenerator
              template={MaintenanceTemplate}
              data={record}
              fileName={`orden-mantenimiento-${record.id ?? "sin-id"}.pdf`}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setMaintenanceList?.(record);
                setMaintenanceDialog(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            description="Esta acción no se puede deshacer"
            okText="Eliminar"
            cancelText="Cancelar"
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
        <div className="mx-auto space-y-6">
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
      <div className="mx-auto">
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
                    { label: "En proceso", value: "EN_PROCESO" },
                    { label: "Esperando insumos", value: "ESPERANDO_INSUMOS" },
                    { label: "Finalizado", value: "FINALIZADO" },
                    { label: "Anulado", value: "ANULADO" },
                    { label: "Rechazado", value: "RECHAZADO" },
                  ]}
                />
                <Select
                  allowClear
                  className="w-44"
                  placeholder={
                    <span className="flex items-center gap-1">
                      <FilterOutlined /> Tipo
                    </span>
                  }
                  value={typeFilter}
                  onChange={(v) => setTypeFilter(v)}
                  options={[
                    { label: "Preventivo", value: "PREVENTIVO" },
                    { label: "Correctivo", value: "CORRECTIVO" },
                  ]}
                />
                <DatePicker.RangePicker
                  allowClear
                  className="w-[260px]"
                  placeholder={["Desde (Fecha)", "Hasta (Fecha)"]}
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
                  onClick={() => setMaintenanceDialog(true)}
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
              onChange={handleTableChange}
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
        open={maintenanceDialog}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 border-blue-600 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                <CheckCircleOutlined className="text-primary mr-3 text-3xl text-blue-600" />
                {maintenanceList ? `Modificar Orden #${maintenanceList.id}` : "Crear Orden"}
              </h2>
            </div>
          </div>
        }
        onCancel={hideMaintenanceFormDialog}
        footer={null}
      >
        <MaintenanceForm
          maintenanceLists={maintenanceLists}
          setMaintenanceLists={setMaintenanceLists}
          maintenanceList={maintenanceList}
          hideMaintenanceFormDialog={hideMaintenanceFormDialog}
        />
      </Modal>
    </main>
  );
};

export default MaintenanceList;

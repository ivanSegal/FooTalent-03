"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
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
  ToolOutlined,
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
  MaintenanceActivityForm,
  type MaintenanceActivityItem,
  maintenanceActivitiesService,
} from "@/features/maintenance";
import type { TableProps } from "antd";
import { NormalizedApiError } from "@/types/api";
import { showAlert, showConfirmAlert } from "@/utils/showAlert";
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
  // Nuevo: estado para actividades (crear/editar)
  const [activities, setActivities] = useState<MaintenanceActivityItem[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<MaintenanceActivityItem | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  // Modal y datos para ver actividades por orden (similar a Ítems en Vessels)
  const [activitiesManagerOrderId, setActivitiesManagerOrderId] = useState<number | null>(null);
  const [activitiesModalData, setActivitiesModalData] = useState<MaintenanceActivityItem[]>([]);
  console.log("activitiesModalData", activitiesModalData);
  const [activitiesModalLoading, setActivitiesModalLoading] = useState(false);
  // Nuevo: cache de conteos por orden y paginación del modal
  const [countsByOrder, setCountsByOrder] = useState<Record<number, number>>({});
  const [activitiesModalPage, setActivitiesModalPage] = useState<number>(1);
  const [activitiesModalSize, setActivitiesModalSize] = useState<number>(10);
  const [activitiesModalTotal, setActivitiesModalTotal] = useState<number>(0);
  // Filtros y ordenamiento
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [fechaProgRange, setFechaProgRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  // Nuevo: estado de paginación visible de la tabla principal (para precargar conteos visibles)
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(8);

  // Cargar actividades para una orden vía endpoint /search (server-side paginado)
  const loadActivitiesForOrder = useCallback(
    async (orderId: number, page = activitiesModalPage, size = activitiesModalSize) => {
      setActivitiesModalLoading(true);
      try {
        const resp = await maintenanceActivitiesService.searchByOrder(orderId, {
          page: page - 1,
          size,
        });
        console.log("resp", resp);
        setActivitiesModalData(resp.content ?? []);
        setActivitiesModalTotal(resp.totalElements ?? resp.content?.length ?? 0);
        setActivitiesModalPage((resp.number ?? page - 1) + 1);
        setActivitiesModalSize(resp.size ?? size);
      } finally {
        setActivitiesModalLoading(false);
      }
    },
    [activitiesModalPage, activitiesModalSize],
  );

  // Obtener conteo de actividades para una orden (para el Tag en la lista principal)
  const refreshCountForOrder = useCallback(async (orderId: number) => {
    try {
      const count = await maintenanceActivitiesService.countByOrder(orderId);
      setCountsByOrder((prev) => ({ ...prev, [orderId]: count }));
    } catch {
      setCountsByOrder((prev) => ({ ...prev, [orderId]: 0 }));
    }
  }, []);

  // Precargar conteos para filas visibles en la tabla principal
  const preloadCountsFor = useCallback(
    (orders: MaintenanceListItem[]) => {
      const idsToFetch = orders
        .map((o) => o.id)
        .filter((id): id is number => typeof id === "number")
        .filter((id) => countsByOrder[id] === undefined);
      if (!idsToFetch.length) return;
      // Ejecutar en paralelo (el tamaño visible es pequeño)
      void Promise.all(idsToFetch.map((id) => refreshCountForOrder(id)));
    },
    [countsByOrder, refreshCountForOrder],
  );

  // Al abrir el modal de actividades, cargar listado y conteo desde el backend
  useEffect(() => {
    if (activitiesManagerOrderId != null) {
      void loadActivitiesForOrder(activitiesManagerOrderId);
      void refreshCountForOrder(activitiesManagerOrderId);
    }
  }, [activitiesManagerOrderId, loadActivitiesForOrder, refreshCountForOrder]);

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
    pagination,
    _filters,
    sorter,
  ) => {
    // Actualiza pagina actual para precarga de conteos
    if (pagination && pagination.current) setTablePage(pagination.current);
    if (pagination && pagination.pageSize) setTablePageSize(pagination.pageSize);
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
  const hideMaintenanceFormDialog = () => {
    setMaintenanceList(null); // Limpia el estado del mantenimiento seleccionado
    setMaintenanceDialog(false);
  };
  // Nuevo: cerrar modal de actividad (crear/editar)
  // Removed old closeActivityForm (switched to inline onClose that refreshes from backend)

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

  // Pre-cargar conteos para las filas visibles de la tabla principal (ubicado después de 'filtered')
  useEffect(() => {
    const start = (tablePage - 1) * tablePageSize;
    const visible = filtered.slice(start, start + tablePageSize);
    preloadCountsFor(visible);
  }, [filtered, tablePage, tablePageSize, preloadCountsFor]);

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
    // Actividades (similar a Ítems en Vessels)
    {
      title: "Actividades",
      key: "activitiesCount",
      width: 110,
      render: (_: unknown, record) => {
        const count = record.id != null ? countsByOrder[record.id] : 0;
        return (
          <Tooltip title="Ver actividades">
            <Tag
              color={count ? "blue" : undefined}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setActivitiesManagerOrderId(record.id ?? null);
                setSelectedActivity(null);
                setShowActivityForm(false);
              }}
            >
              {count ?? 0} {count === 1 ? "actividad" : "actividades"}
            </Tag>
          </Tooltip>
        );
      },
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
          {/* Nueva actividad: abre modal de actividades con formulario */}
          <Tooltip title="Nueva actividad">
            <Button
              size="small"
              type="text"
              icon={<ToolOutlined />}
              onClick={() => {
                setActivitiesManagerOrderId(record.id ?? null);
                setSelectedActivity(null);
                setShowActivityForm(true);
              }}
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
          <Tooltip title="Eliminar">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                const confirmed = await showConfirmAlert(
                  "Confirmar eliminación",
                  "Esta acción no se puede deshacer",
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!confirmed) return;
                if (record.id == null) return;
                try {
                  await maintenanceService.remove(record.id);
                  await load();
                  await showAlert("Éxito", "Orden eliminada.", "success");
                } catch (e) {
                  await showAlert(
                    "Error al eliminar",
                    (e as Error)?.message || "No se pudo eliminar la orden",
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

  // Columnas del modal de actividades por orden
  const activitiesModalColumns: ColumnsType<MaintenanceActivityItem> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tipo", dataIndex: "activityType", key: "activityType" },
    {
      title: "Ítem",
      key: "vesselItem",
      render: (_: unknown, r: MaintenanceActivityItem) => r.vesselItemName ?? `#${r.vesselItemId}`,
    },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Mov. inventario",
      dataIndex: "inventoryMovementIds",
      key: "inventoryMovementIds",
      width: 200,
      render: (_: unknown, r: MaintenanceActivityItem) => {
        const ids = r.inventoryMovementIds ?? r.inventoryMovementsIds;
        return Array.isArray(ids) && ids.length ? (
          <span className="font-mono text-xs">[{ids.join(", ")}]</span>
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      width: 200,
      render: (_: unknown, record: MaintenanceActivityItem) => (
        <Space size="small">
          <Tooltip title="Editar actividad">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedActivity(record);
                setShowActivityForm(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Eliminar actividad">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                const confirmed = await showConfirmAlert(
                  "Confirmar eliminación",
                  "Esta acción no se puede deshacer",
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!confirmed) return;
                try {
                  await maintenanceActivitiesService.remove(record.id);
                  await Promise.all([
                    loadActivitiesForOrder(
                      record.maintenanceOrderId,
                      activitiesModalPage,
                      activitiesModalSize,
                    ),
                    refreshCountForOrder(record.maintenanceOrderId),
                  ]);
                  await showAlert("Éxito", "Actividad eliminada.", "success");
                } catch (e) {
                  await showAlert(
                    "Error al eliminar",
                    (e as Error)?.message || "No se pudo eliminar la actividad",
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

  // vesselId que usará el formulario (create/edit) dentro del modal de actividades
  const vesselIdForActivityForm = useMemo(() => {
    const orderId = selectedActivity?.maintenanceOrderId ?? activitiesManagerOrderId ?? null;
    if (orderId != null) {
      const order = maintenanceLists.find((o) => o.id === orderId);
      return order?.vesselId;
    }
    return undefined;
  }, [selectedActivity, activitiesManagerOrderId, maintenanceLists]);

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
              loading={loading}
              dataSource={filtered}
              onChange={handleTableChange}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
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

      {/* Modal para ver actividades por orden (incluye crear/editar) */}
      <Modal
        open={activitiesManagerOrderId != null}
        title={
          activitiesManagerOrderId != null
            ? `Actividades de la Orden #${activitiesManagerOrderId}`
            : "Actividades"
        }
        onCancel={() => {
          setActivitiesManagerOrderId(null);
          setActivitiesModalData([]);
          setSelectedActivity(null);
          setShowActivityForm(false);
          setActivitiesModalPage(1);
          setActivitiesModalTotal(0);
        }}
        footer={null}
        width={900}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">Total: {activitiesModalTotal}</span>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={async () => {
                if (activitiesManagerOrderId != null)
                  await loadActivitiesForOrder(
                    activitiesManagerOrderId,
                    activitiesModalPage,
                    activitiesModalSize,
                  );
              }}
              disabled={activitiesModalLoading}
            >
              Actualizar
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedActivity(null);
                setShowActivityForm(true);
              }}
            >
              Agregar actividad
            </Button>
          </div>
        </div>

        {showActivityForm && activitiesManagerOrderId != null && (
          <div className="mb-3 rounded-md border border-gray-200 p-3">
            {(() => {
              const order = maintenanceLists.find((o) => o.id === activitiesManagerOrderId);
              const initialOrder = selectedActivity
                ? undefined
                : order
                  ? `${order.id}-${order.vesselName}-${order.maintenanceType}`
                  : undefined;
              return (
                <MaintenanceActivityForm
                  activities={activities}
                  setActivities={setActivities}
                  activity={selectedActivity}
                  onClose={async () => {
                    // Reemplaza closeActivityForm para refrescar listado y conteo desde backend
                    if (activitiesManagerOrderId != null) {
                      await loadActivitiesForOrder(
                        activitiesManagerOrderId,
                        activitiesModalPage,
                        activitiesModalSize,
                      );
                      await refreshCountForOrder(activitiesManagerOrderId);
                    }
                    setSelectedActivity(null);
                    setShowActivityForm(false);
                  }}
                  initialMaintenanceOrder={initialOrder}
                  vesselId={vesselIdForActivityForm}
                  maintenanceOrderId={activitiesManagerOrderId}
                />
              );
            })()}
          </div>
        )}

        <Table
          size="small"
          rowKey="id"
          columns={activitiesModalColumns}
          dataSource={activitiesModalData}
          loading={activitiesModalLoading}
          pagination={{
            pageSize: activitiesModalSize,
            current: activitiesModalPage,
            total: activitiesModalTotal,
            showSizeChanger: false,
            onChange: (page) => {
              setActivitiesModalPage(page);
              if (activitiesManagerOrderId != null) {
                void loadActivitiesForOrder(activitiesManagerOrderId, page, activitiesModalSize);
              }
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Modal>
    </main>
  );
};

export default MaintenanceList;

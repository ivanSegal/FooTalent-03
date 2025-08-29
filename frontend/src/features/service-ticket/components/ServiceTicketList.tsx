"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Input, Modal, Space, Table, Tooltip, Tag } from "antd";
// SweetAlert confirm helper
import { showConfirmAlert } from "@/utils/showAlert";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  type ServiceTicketListItem,
  serviceTicketService,
  ServiceTicketTemplate,
  type ServiceTicketData,
} from "@/features/service-ticket";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import PDFGenerator from "@/components/pdf/PDFGenerator";

import type { Dayjs } from "dayjs";
import { showAlert } from "@/utils/showAlert";
import ServiceTicketForm from "./ServiceTicketForm";
import { serviceTicketDetailService } from "@/features/service-ticket/services/serviceTicketDetail.service";
import type { ServiceTicketDetail } from "@/features/service-ticket/types/serviceTicketDetail.types";
import { serviceTicketTravelService } from "@/features/service-ticket/services/serviceTicketTravel.service";
import type { ServiceTicketTravel } from "@/features/service-ticket/types/serviceTicketTravel.types";
import ServiceTicketTravelForm from "@/features/service-ticket/components/ServiceTicketTravelForm";

export default function ServiceTicketList() {
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["serviceTickets", { page: 0, size: 50, sort: tableSort }],
    queryFn: () => serviceTicketService.list({ page: 0, size: 50, sort: tableSort }),
  });

  const [items, setItems] = useState<ServiceTicketListItem[]>([]);
  const [current, setCurrent] = useState<ServiceTicketListItem | null>(null);
  const [currentDetail, setCurrentDetail] = useState<ServiceTicketDetail | null>(null);
  const [detailsByTicketId, setDetailsByTicketId] = useState<
    Record<number, ServiceTicketDetail | null>
  >({});
  const [travelsByDetailId, setTravelsByDetailId] = useState<Record<number, ServiceTicketTravel[]>>(
    {},
  );
  const [dialog, setDialog] = useState(false);

  // travel modal state (unified list + form)
  const [travelsModalOpen, setTravelsModalOpen] = useState(false);
  const [travelsModalDetailId, setTravelsModalDetailId] = useState<number | null>(null);
  const [travelEditing, setTravelEditing] = useState<ServiceTicketTravel | null>(null);
  const [showTravelForm, setShowTravelForm] = useState(false);

  // Resolve current ticket (boleta) from the selected travel detail id
  const travelsModalTicket = useMemo(() => {
    if (travelsModalDetailId == null) return null;
    const entry = Object.entries(detailsByTicketId).find(([, d]) => d?.id === travelsModalDetailId);
    const ticketId = entry ? Number(entry[0]) : null;
    if (!ticketId) return null;
    return items.find((i) => i.id === ticketId) ?? null;
  }, [travelsModalDetailId, detailsByTicketId, items]);

  // filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  useEffect(() => {
    if (data?.content) setItems(data.content);
  }, [data]);

  // Fetch details for the listed tickets to unify view
  useEffect(() => {
    let abort = false;
    (async () => {
      if (!items.length) {
        setDetailsByTicketId({});
        return;
      }
      try {
        const results = await Promise.all(
          items.map(async (it) => {
            try {
              const detail = await serviceTicketDetailService.getOneByServiceTicket(it.id);
              return [it.id, detail] as [number, ServiceTicketDetail | null];
            } catch {
              return [it.id, null] as [number, ServiceTicketDetail | null];
            }
          }),
        );
        if (!abort) {
          const map: Record<number, ServiceTicketDetail | null> = {};
          for (const [id, det] of results) map[id] = det;
          setDetailsByTicketId(map);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      abort = true;
    };
  }, [items]);

  // Fetch travels for each available detail
  useEffect(() => {
    let abort = false;
    (async () => {
      const detailIds = Object.values(detailsByTicketId)
        .filter((d): d is ServiceTicketDetail => !!d)
        .map((d) => d.id);
      if (!detailIds.length) {
        setTravelsByDetailId({});
        return;
      }
      try {
        const results = await Promise.all(
          detailIds.map(async (detailId) => {
            try {
              const travels = await serviceTicketTravelService.listByDetail(detailId);
              return [detailId, travels] as [number, ServiceTicketTravel[]];
            } catch {
              return [detailId, [] as ServiceTicketTravel[]] as [number, ServiceTicketTravel[]];
            }
          }),
        );
        if (!abort) {
          const map: Record<number, ServiceTicketTravel[]> = {};
          for (const [id, travels] of results) map[id] = travels;
          setTravelsByDetailId(map);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      abort = true;
    };
  }, [detailsByTicketId]);

  // Lazy load travels when opening modal for a specific detail
  useEffect(() => {
    (async () => {
      if (!travelsModalOpen || travelsModalDetailId == null) return;
      if (travelsByDetailId[travelsModalDetailId]) return;
      try {
        const travels = await serviceTicketTravelService.listByDetail(travelsModalDetailId);
        setTravelsByDetailId((prev) => ({ ...prev, [travelsModalDetailId]: travels }));
      } catch {
        // ignore
      }
    })();
  }, [travelsModalOpen, travelsModalDetailId, travelsByDetailId]);

  const openTravelsModal = (detailId: number, openForm = false, editing?: ServiceTicketTravel) => {
    setTravelsModalDetailId(detailId);
    setTravelEditing(editing ?? null);
    setShowTravelForm(openForm);
    setTravelsModalOpen(true);
  };

  const closeTravelsModal = () => {
    setTravelsModalOpen(false);
    setTravelsModalDetailId(null);
    setTravelEditing(null);
    setShowTravelForm(false);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((i) => {
      const d = detailsByTicketId[i.id];
      const travels = d ? travelsByDetailId[d.id] || [] : [];
      const mSearch =
        !term ||
        i.vesselAttended.toLowerCase().includes(term) ||
        i.vesselName.toLowerCase().includes(term) ||
        i.solicitedBy.toLowerCase().includes(term) ||
        i.responsibleUsername.toLowerCase().includes(term) ||
        i.reportTravelNro.toLowerCase().includes(term) ||
        (d?.serviceArea?.toLowerCase?.().includes(term) ?? false) ||
        (d?.serviceType?.toLowerCase?.().includes(term) ?? false) ||
        (d?.description?.toLowerCase?.().includes(term) ?? false) ||
        (d?.patronFullName?.toLowerCase?.().includes(term) ?? false) ||
        (d?.marinerFullName?.toLowerCase?.().includes(term) ?? false) ||
        (d?.captainFullName?.toLowerCase?.().includes(term) ?? false) ||
        travels.some(
          (t) =>
            t.origin.toLowerCase().includes(term) ||
            t.destination.toLowerCase().includes(term) ||
            t.departureTime.toLowerCase().includes(term) ||
            t.arrivalTime.toLowerCase().includes(term),
        );
      const mDate = (() => {
        if (!dateRange) return true;
        const [from, to] = dateRange;
        if (!from || !to) return true;
        const [dDay, dMonth, dYear] = i.travelDate.split("-").map((v) => parseInt(v, 10));
        const dt = new Date(dYear, dMonth - 1, dDay).getTime();
        return dt >= from.startOf("day").valueOf() && dt <= to.endOf("day").valueOf();
      })();
      return mSearch && mDate;
    });
  }, [items, search, dateRange, detailsByTicketId, travelsByDetailId]);

  const onClose = useCallback(() => {
    setCurrent(null);
    setCurrentDetail(null);
    setDialog(false);
  }, []);

  const handleTableChange: TableProps<ServiceTicketListItem>["onChange"] = (
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
    void refetch();
  };

  // Columnas principales

  const columns: ColumnsType<ServiceTicketListItem> = [
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
    },
    { title: "Viaje N°", dataIndex: "travelNro", key: "travelNro", width: 100, sorter: true },
    {
      title: "Fecha viaje",
      dataIndex: "travelDate",
      key: "travelDate",
      width: 120,
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("travelDate,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
    },

    { title: "Embarcación atendida", dataIndex: "vesselAttended", key: "vesselAttended" },

    { title: "Solicitado por", dataIndex: "solicitedBy", key: "solicitedBy" },
    { title: "Reporte N°", dataIndex: "reportTravelNro", key: "reportTravelNro" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 110,
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("status,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
      render: (val: boolean) => (
        <Tag color={val ? "green" : "red"}>{val ? "Abierta" : "Cerrada"}</Tag>
      ),
    },
    // { title: "Código", dataIndex: "code", key: "code" },
    // { title: "Control N°", dataIndex: "checkingNro", key: "checkingNro", width: 110 },

    { title: "Embarcación", dataIndex: "vesselName", key: "vesselName" },

    { title: "Responsable", dataIndex: "responsibleUsername", key: "responsibleUsername" },

    // Campos del detalle
    {
      title: "Área servicio",
      key: "serviceArea",
      render: (_: unknown, record) => detailsByTicketId[record.id]?.serviceArea ?? "-",
    },
    {
      title: "Tipo servicio",
      key: "serviceType",
      render: (_: unknown, record) => detailsByTicketId[record.id]?.serviceType ?? "-",
    },
    {
      title: "Horas",
      key: "hoursTraveled",
      width: 80,
      render: (_: unknown, record) => detailsByTicketId[record.id]?.hoursTraveled ?? "-",
    },
    {
      title: "Patrón",
      key: "patronFullName",
      render: (_: unknown, record) => detailsByTicketId[record.id]?.patronFullName ?? "-",
    },
    {
      title: "Marinero",
      key: "marinerFullName",
      render: (_: unknown, record) => detailsByTicketId[record.id]?.marinerFullName ?? "-",
    },
    {
      title: "Capitán",
      key: "captainFullName",
      render: (_: unknown, record) => detailsByTicketId[record.id]?.captainFullName ?? "-",
    },
    {
      title: "Viajes",
      key: "travelsCount",
      render: (_: unknown, record) => {
        const detail = detailsByTicketId[record.id];
        const count = detail ? travelsByDetailId[detail.id]?.length || 0 : 0;
        return (
          <Tag
            color={count ? "blue" : undefined}
            style={{ cursor: detail ? "pointer" : "not-allowed" }}
            onClick={() => detail && openTravelsModal(detail.id)}
          >
            {count} viajes
          </Tag>
        );
      },
    },

    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Imprimir / Vista previa">
            <PDFGenerator
              template={ServiceTicketTemplate}
              data={
                {
                  ...(record as unknown as ServiceTicketData),
                  detail: detailsByTicketId[record.id] ?? null,
                  travels: detailsByTicketId[record.id]
                    ? travelsByDetailId[(detailsByTicketId[record.id] as ServiceTicketDetail).id] ||
                      []
                    : [],
                } as ServiceTicketData
              }
              fileName={`boleta-servicio-${record.id ?? "sin-id"}.pdf`}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrent(record);
                setCurrentDetail(detailsByTicketId[record.id] ?? null);
                setDialog(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Ver viajes / Agregar">
            <Button
              size="small"
              type="text"
              icon={<PlusOutlined />}
              onClick={() => {
                const detail = detailsByTicketId[record.id];
                if (!detail) {
                  void showAlert("Sin detalle", "Primero crea el detalle.", "warning");
                  return;
                }
                openTravelsModal(detail.id, true);
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
                const ok = await showConfirmAlert(
                  "¿Eliminar boleta?",
                  `Vas a eliminar la boleta #${record.id}${record.reportTravelNro ? ` – ${record.reportTravelNro}` : ""}. Esta acción no se puede deshacer.`,
                  "Eliminar",
                  "Cancelar",
                  { icon: "warning" },
                );
                if (!ok) return;
                try {
                  await serviceTicketService.remove(record.id);
                  setItems((prev) => prev.filter((x) => x.id !== record.id));
                  setDetailsByTicketId((prev) => {
                    const copy = { ...prev };
                    delete copy[record.id];
                    return copy;
                  });
                  await showAlert(
                    "Eliminado",
                    `La boleta #${record.id}${record.reportTravelNro ? ` – ${record.reportTravelNro}` : ""} fue eliminada correctamente`,
                    "success",
                  );
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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Boletas de servicio</h1>
            <p className="mt-1 text-sm text-gray-600">Listado y gestión de boletas de servicio.</p>
          </div>
        </header>
        <section className="space-y-4">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <Input.Search
                  allowClear
                  placeholder="Buscar embarcación, barco, solicitante o responsable"
                  className="max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <DatePicker.RangePicker
                  allowClear
                  className="w-[260px]"
                  placeholder={["Desde (Fecha)", "Hasta (Fecha)"]}
                  onChange={(values) =>
                    setDateRange(
                      values && values[0] && values[1] ? (values as [Dayjs, Dayjs]) : null,
                    )
                  }
                  value={dateRange || undefined}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCurrent(null);
                    setCurrentDetail(null);
                    setDialog(true);
                  }}
                >
                  Nueva boleta
                </Button>
              </div>
            </div>
            <Table
              size="small"
              rowKey="id"
              loading={isLoading}
              columns={columns}
              dataSource={filtered}
              onChange={handleTableChange}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: "max-content" }}
            />
          </div>
        </section>
      </div>

      {/* Dialogo de crear/editar boleta + detalle */}
      <Modal
        // title={current ? "Editar boleta" : "Nueva boleta"}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                <CheckCircleOutlined className="text-primary mr-3 text-3xl text-blue-600" />
                {current
                  ? `Modificar Boleta #${current.id}${current.reportTravelNro ? ` – ${current.reportTravelNro}` : ""}`
                  : "Crear Boleta"}
              </h2>
            </div>
          </div>
        }
        open={dialog}
        onCancel={onClose}
        footer={null}
      >
        <ServiceTicketForm
          items={items}
          setItems={setItems}
          current={current}
          onClose={onClose}
          currentDetail={currentDetail}
          initialStep={current ? 1 : 0}
          onDetailSaved={(d) =>
            setDetailsByTicketId((prev) => ({ ...(prev || {}), [d.serviceTicketId]: d }))
          }
        />
      </Modal>

      {/* Dialogo de agregar/editar viaje unificado en modal de lista */}
      <Modal
        // title={travelsModalDetailId ? `Viajes del detalle #${travelsModalDetailId}` : "Viajes"}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                <CheckCircleOutlined className="text-primary mr-3 text-3xl text-blue-600" />
                {travelsModalTicket
                  ? `Viajes de la boleta #${travelsModalTicket.id}${travelsModalTicket.reportTravelNro ? ` – ${travelsModalTicket.reportTravelNro}` : ""}`
                  : "Viajes"}
              </h2>
            </div>
          </div>
        }
        open={travelsModalOpen}
        onCancel={closeTravelsModal}
        footer={null}
      >
        {travelsModalDetailId != null && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {travelsByDetailId[travelsModalDetailId]?.length || 0} viajes
              </div>
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setTravelEditing(null);
                  setShowTravelForm(true);
                }}
              >
                Agregar viaje
              </Button>
            </div>

            {showTravelForm && (
              <ServiceTicketTravelForm
                serviceTicketDetailId={travelsModalDetailId}
                current={travelEditing ?? undefined}
                onSaved={(t) => {
                  setTravelsByDetailId((prev) => {
                    const list = prev[travelsModalDetailId] || [];
                    const exists = list.some((x) => x.id === t.id);
                    const newList = exists
                      ? list.map((x) => (x.id === t.id ? t : x))
                      : [t, ...list];
                    return { ...prev, [travelsModalDetailId]: newList };
                  });
                  setShowTravelForm(false);
                  setTravelEditing(null);
                }}
                onClose={() => setShowTravelForm(false)}
              />
            )}

            <Table
              size="small"
              rowKey="id"
              columns={[
                { title: "Origen", dataIndex: "origin", key: "origin" },
                { title: "Destino", dataIndex: "destination", key: "destination" },
                { title: "Salida", dataIndex: "departureTime", key: "departureTime", width: 90 },
                { title: "Llegada", dataIndex: "arrivalTime", key: "arrivalTime", width: 90 },
                {
                  title: "Acciones",
                  key: "actions",
                  align: "right" as const,
                  render: (_: unknown, tr: ServiceTicketTravel) => (
                    <Space size="small">
                      <Tooltip title="Editar viaje">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => {
                            setTravelEditing(tr);
                            setShowTravelForm(true);
                          }}
                          icon={<EditOutlined />}
                        />
                      </Tooltip>

                      <Tooltip title="Eliminar viaje">
                        <Button
                          size="small"
                          type="link"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={async () => {
                            const ok = await showConfirmAlert(
                              "¿Eliminar viaje?",
                              `Vas a eliminar el viaje${tr.origin && tr.destination ? ` ${tr.origin} → ${tr.destination}` : ""}${tr.departureTime ? ` (${tr.departureTime} - ${tr.arrivalTime})` : ""}. Esta acción no se puede deshacer.`,
                              "Eliminar",
                              "Cancelar",
                              { icon: "warning" },
                            );
                            if (!ok) return;
                            try {
                              await serviceTicketTravelService.remove(tr.id);
                              setTravelsByDetailId((prev) => ({
                                ...prev,
                                [travelsModalDetailId!]: (prev[travelsModalDetailId!] || []).filter(
                                  (x) => x.id !== tr.id,
                                ),
                              }));
                              await showAlert(
                                "Eliminado",
                                "El viaje fue eliminado correctamente",
                                "success",
                              );
                            } catch (e) {
                              await showAlert(
                                "Error",
                                (e as Error)?.message || "No se pudo eliminar el viaje",
                                "error",
                              );
                            }
                          }}
                        />
                      </Tooltip>
                    </Space>
                  ),
                },
              ]}
              dataSource={travelsByDetailId[travelsModalDetailId] || []}
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </main>
  );
}

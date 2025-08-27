"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  ServiceTicketForm,
  type ServiceTicketListItem,
  serviceTicketService,
  ServiceTicketTemplate,

  // Nuevos imports para Detalle
  ServiceTicketDetailForm,
  serviceTicketDetailService,
  type ServiceTicketDetail,
  // Imports para Travels
  ServiceTicketTravelForm,
  serviceTicketTravelService,
  type ServiceTicketTravel,
} from "@/features/service-ticket";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PDFGenerator from "@/components/pdf/PDFGenerator";

import type { Dayjs } from "dayjs";
import { showAlert } from "@/utils/showAlert";

export default function ServiceTicketList() {
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["serviceTickets", { page: 0, size: 50, sort: tableSort }],
    queryFn: () => serviceTicketService.list({ page: 0, size: 50, sort: tableSort }),
  });

  const [items, setItems] = useState<ServiceTicketListItem[]>([]);
  const [current, setCurrent] = useState<ServiceTicketListItem | null>(null);
  const [dialog, setDialog] = useState(false);

  // Estado para Detalles de Boleta
  const [detailDialog, setDetailDialog] = useState(false);
  const [detailTicket, setDetailTicket] = useState<ServiceTicketListItem | null>(null);

  // Estado para Travels del Detail
  const [detailEntity, setDetailEntity] = useState<ServiceTicketDetail | null>(null); // único
  const [travelItems, setTravelItems] = useState<ServiceTicketTravel[]>([]);
  const [travelCurrent, setTravelCurrent] = useState<ServiceTicketTravel | null>(null);
  const [travelLoading, setTravelLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  useEffect(() => {
    if (data?.content) setItems(data.content);
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((i) => {
      const mSearch =
        !term ||
        i.vesselAttended.toLowerCase().includes(term) ||

        i.vesselName.toLowerCase().includes(term) ||

        i.solicitedBy.toLowerCase().includes(term) ||
        i.responsibleUsername.toLowerCase().includes(term) ||
        i.reportTravelNro.toLowerCase().includes(term) ||
        i.code.toLowerCase().includes(term);
      const mDate = (() => {
        if (!dateRange) return true;
        const [from, to] = dateRange;
        if (!from || !to) return true;
        const [d, m, y] = i.travelDate.split("-").map((v) => parseInt(v, 10));
        const dt = new Date(y, m - 1, d).getTime();
        return dt >= from.startOf("day").valueOf() && dt <= to.endOf("day").valueOf();
      })();
      return mSearch && mDate;
    });
  }, [items, search, dateRange]);

  const onClose = useCallback(() => {
    setCurrent(null);
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

  // Abrir modal de detalles para una boleta
  const openDetails = async (ticket: ServiceTicketListItem) => {
    setDetailTicket(ticket);
    setDetailDialog(true);
    setDetailEntity(null);
    setTravelItems([]);
    setTravelCurrent(null);

    try {
      // Obtener (o crear) el único detalle
      const detail = await serviceTicketDetailService.getOneByServiceTicket(ticket.id);
      if (!detail) {
        // si no existe, preparamos el form vacío; el usuario lo creará con el form
        setDetailEntity(null);
      } else {
        setDetailEntity(detail);
        // cargar travels
        setTravelLoading(true);
        const travels = await serviceTicketTravelService.listByDetail(detail.id);
        setTravelItems(travels);
      }
    } catch (e) {
      await showAlert(
        "No se pudieron cargar los detalles",
        (e as Error)?.message || "Intenta nuevamente.",
        "error",
      );
    } finally {
      setTravelLoading(false);
    }
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
    { title: "Código", dataIndex: "code", key: "code" },
    { title: "Control N°", dataIndex: "checkingNro", key: "checkingNro", width: 110 },

    { title: "Embarcación", dataIndex: "vesselName", key: "vesselName" },

    { title: "Responsable", dataIndex: "responsibleUsername", key: "responsibleUsername" },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>

          <Tooltip title="Detalle">
            <Button size="small" type="text" onClick={() => void openDetails(record)}>
              Detalle
            </Button>
          </Tooltip>

          <Tooltip title="Imprimir / Vista previa">
            <PDFGenerator
              template={ServiceTicketTemplate}
              data={record}
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
                await serviceTicketService.remove(record.id);
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

  const travelColumns: ColumnsType<ServiceTicketTravel> = [
    { title: "Origen", dataIndex: "origin", key: "origin" },
    { title: "Destino", dataIndex: "destination", key: "destination" },
    { title: "Salida", dataIndex: "departureTime", key: "departureTime", width: 110 },
    { title: "Llegada", dataIndex: "arrivalTime", key: "arrivalTime", width: 110 },
    { title: "Total", dataIndex: "totalTraveledTime", key: "totalTraveledTime", width: 90 },
    {
      title: "Acciones",
      key: "actions",
      align: "right" as const,
      render: (_: unknown, rec) => (
        <Space size="small">
          <Button size="small" type="text" onClick={() => setTravelCurrent(rec)}>
            Editar
          </Button>
          <Popconfirm
            title="Eliminar viaje"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={async () => {
              try {
                await serviceTicketTravelService.remove(rec.id);
                setTravelItems((prev) => prev.filter((d) => d.id !== rec.id));
              } catch (e) {
                await showAlert(
                  "Error al eliminar",
                  (e as Error)?.message || "No se pudo eliminar el viaje",
                  "error",
                );
              }
            }}
          >
            <Button size="small" type="text" danger>
              Eliminar
            </Button>
          </Popconfirm>
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
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDialog(true)}>
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
      <Modal
        open={dialog}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 border-blue-600 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                {current ? `Modificar Boleta #${current.id}` : "Crear Boleta"}
              </h2>
            </div>
          </div>
        }
        onCancel={onClose}
        footer={null}
      >

        {current?.id && (
          <div className="mb-3 flex justify-end">
            <Button onClick={() => void openDetails(current)}>Detalle</Button>
          </div>
        )}
        <ServiceTicketForm items={items} setItems={setItems} current={current} onClose={onClose} />
      </Modal>

      {/* Modal de Detalles */}
      <Modal
        open={detailDialog}
        onCancel={() => {
          setDetailDialog(false);
          setDetailTicket(null);
          setDetailEntity(null);
          setTravelItems([]);
          setTravelCurrent(null);
        }}
        footer={null}
        width={900}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 border-blue-600 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                {detailTicket ? `Detalle de Boleta #${detailTicket.id}` : "Detalle"}
              </h2>
              {detailTicket && (
                <p className="text-sm text-gray-600">{`${detailTicket.vesselName} — ${detailTicket.travelDate}`}</p>
              )}
            </div>
          </div>
        }
      >
        {detailTicket && (
          <div className="space-y-6">
            {/* Sección: Detalle único */}
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {detailEntity ? `Detalle #${detailEntity.id}` : "Nuevo detalle"}
                </h3>
                {/* Se elimina botón 'Nuevo' para evitar múltiples detalles por boleta */}
              </div>
              <ServiceTicketDetailForm
                serviceTicketId={detailTicket.id}
                current={detailEntity}
                onSaved={async (saved) => {
                  setDetailEntity(saved);
                  // Actualizar items legacy si se usan en alguna parte
                  // setDetailItems([saved]);
                  // Cargar travels del nuevo/actual detail
                  setTravelLoading(true);
                  try {
                    const travels = await serviceTicketTravelService.listByDetail(saved.id);
                    setTravelItems(travels);
                  } finally {
                    setTravelLoading(false);
                  }
                }}
              />
            </div>

            {/* Sección: Travels del detalle */}
            <div className="rounded-md border border-gray-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-base font-semibold">Viajes</h3>
                <Button
                  onClick={() => setTravelCurrent(null)}
                  type="dashed"
                  disabled={!detailEntity}
                >
                  Nuevo viaje
                </Button>
              </div>

              {detailEntity ? (
                <ServiceTicketTravelForm
                  serviceTicketDetailId={detailEntity.id}
                  current={travelCurrent}
                  onSaved={(saved) => {
                    setTravelItems((prev) => {
                      const idx = prev.findIndex((d) => d.id === saved.id);
                      if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                      }
                      return [saved, ...prev];
                    });
                    setTravelCurrent(null);
                  }}
                  onClose={() => setTravelCurrent(null)}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  Guarda el detalle para habilitar el registro de viajes.
                </p>
              )}

              <div className="mt-3">
                <Table
                  size="small"
                  rowKey="id"
                  loading={travelLoading}
                  columns={travelColumns}
                  dataSource={travelItems}
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                />
                {!detailEntity && (
                  <p className="mt-2 text-xs text-gray-500">
                    Crea y guarda el detalle antes de registrar viajes.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

    </main>
  );
}

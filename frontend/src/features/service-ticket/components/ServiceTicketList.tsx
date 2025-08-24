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
        i.boatName.toLowerCase().includes(term) ||
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
    { title: "Embarcación", dataIndex: "vesselAttended", key: "vesselAttended" },
    { title: "Solicitado por", dataIndex: "solicitedBy", key: "solicitedBy" },
    { title: "Reporte N°", dataIndex: "reportTravelNro", key: "reportTravelNro" },
    { title: "Código", dataIndex: "code", key: "code" },
    { title: "Control N°", dataIndex: "checkingNro", key: "checkingNro", width: 110 },
    { title: "Barco", dataIndex: "boatName", key: "boatName" },
    { title: "Responsable", dataIndex: "responsibleUsername", key: "responsibleUsername" },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
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
        <ServiceTicketForm items={items} setItems={setItems} current={current} onClose={onClose} />
      </Modal>
    </main>
  );
}

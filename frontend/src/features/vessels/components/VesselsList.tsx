"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { vesselsService, type Vessel } from "@/features/vessels";
import { vesselItemHoursService } from "@/features/vessels";
import type { VesselItemHoursEntry } from "@/features/vessels";
import VesselsForm from "@/features/vessels/components/VesselsForm";
import { showAlert } from "@/utils/showAlert";
import { vesselItemService } from "@/features/vessels";
import type { VesselItem } from "@/features/vessels";
import VesselItemForm from "@/features/vessels/components/VesselItemForm";
import { VesselItemHoursForm } from "@/features/vessels";

export default function VesselsList() {
  const [items, setItems] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [current, setCurrent] = useState<Vessel | null>(null);
  const [search, setSearch] = useState("");
  const [tableSort, setTableSort] = useState<string | undefined>("id,desc");
  const [itemsManagerVesselId, setItemsManagerVesselId] = useState<number | null>(null);
  const [itemsModalData, setItemsModalData] = useState<VesselItem[]>([]);
  const [itemsModalLoading, setItemsModalLoading] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<VesselItem | null>(null);
  const [allItems, setAllItems] = useState<VesselItem[]>([]);
  // Estado para modal de carga de horas a nivel de lista
  const [hoursVesselId, setHoursVesselId] = useState<number | null>(null);
  const [hoursItems, setHoursItems] = useState<VesselItem[]>([]);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursActiveTab, setHoursActiveTab] = useState<"form" | "history">("form");
  const [hoursInitialReport, setHoursInitialReport] = useState<VesselItemHoursEntry | null>(null);
  const [hoursHistoryRows, setHoursHistoryRows] = useState<VesselItemHoursEntry[]>([]);

  // Estado para historial de cargas de horas
  const [historyVesselId, setHistoryVesselId] = useState<number | null>(null);
  const [historyRows, setHistoryRows] = useState<VesselItemHoursEntry[]>([]);
  const [allHistoryRows, setAllHistoryRows] = useState<VesselItemHoursEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);

  const loadHistoryAll = useCallback(
    async (size = historyPageSize): Promise<VesselItemHoursEntry[]> => {
      setHistoryLoading(true);
      try {
        const firstPage = 0;
        let acc: VesselItemHoursEntry[] = [];
        // Primera petición para conocer totalPages
        const first = await vesselItemHoursService.list({ page: firstPage, size });
        acc = (first.content ?? []).slice();
        const totalPages = first.totalPages ?? 1;
        // Trae el resto de páginas si existen
        for (let p = 1; p < totalPages; p++) {
          const res = await vesselItemHoursService.list({ page: p, size });
          acc = acc.concat(res.content ?? []);
        }
        return acc;
      } catch (e) {
        await showAlert(
          "Error al cargar historial",
          (e as Error)?.message || "No se pudo cargar el historial",
          "error",
        );
        return [];
      } finally {
        setHistoryLoading(false);
      }
    },
    [historyPageSize],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vesselsService.list({ page: 0, size: 100, sort: tableSort });
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

  // Carga todos los ítems una sola vez (o bajo demanda)
  const loadAllItems = useCallback(async (): Promise<VesselItem[]> => {
    setItemsModalLoading(true);
    try {
      const res = await vesselItemService.list({ page: 0, size: 1000 });
      const list = res.content ?? [];
      setAllItems(list);
      return list;
    } catch {
      setAllItems([]);
      return [];
    } finally {
      setItemsModalLoading(false);
    }
  }, []);

  // Prefetch de todos los ítems para acelerar la primera apertura del modal
  useEffect(() => {
    // Prefetch de todos los ítems para acelerar la primera apertura del modal
    void loadAllItems();
  }, [loadAllItems]);

  // Helper types y función para obtener el id de embarcación desde el ítem
  type VesselRef = Partial<{
    vesselId: number;
    vessel_id: number;
    vessel: { id?: number };
  }>;

  const getVesselIdFromItem = useCallback((it: VesselItem): number | undefined => {
    const ref = it as unknown as VesselRef;
    return ref.vesselId ?? ref.vessel_id ?? ref.vessel?.id;
  }, []);

  // Calcula y establece los ítems filtrados para una embarcación
  const setFilteredItemsFor = useCallback(
    (vId: number, source?: VesselItem[]) => {
      const base = source ?? allItems;
      const filtered = base.filter((it) => getVesselIdFromItem(it) === vId);
      setItemsModalData(filtered);
    },
    [allItems, getVesselIdFromItem],
  );

  // Al abrir el modal de ítems para una embarcación, asegura los datos y filtra
  useEffect(() => {
    if (itemsManagerVesselId != null) {
      const run = async () => {
        if (!allItems.length) {
          const list = await loadAllItems();
          setFilteredItemsFor(itemsManagerVesselId, list);
        } else {
          setFilteredItemsFor(itemsManagerVesselId);
        }
        setShowItemForm(false);
        setCurrentItem(null);
      };
      void run();
    }
  }, [itemsManagerVesselId, allItems.length, loadAllItems, setFilteredItemsFor]);

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

  const handleTableChange: TableProps<Vessel>["onChange"] = (_pagination, _filters, sorter) => {
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

  const columns: ColumnsType<Vessel> = [
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
      render: (v: Vessel["id"]) => (v ?? "—") as React.ReactNode,
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
      title: "Ítems",
      key: "itemsCount",
      width: 110,
      render: (_: unknown, record) => {
        // Cuenta los ítems asociados a esta embarcación
        const count = allItems.reduce(
          (acc, it) => (getVesselIdFromItem(it) === record.id ? acc + 1 : acc),
          0,
        );

        return (
          <Tooltip title="Ver ítems">
            <Tag
              color={count ? "blue" : undefined}
              style={{ cursor: "pointer" }}
              onClick={() => {
                // Abre el modal; el efecto se encarga de filtrar los ítems
                setItemsManagerVesselId(record.id);
              }}
            >
              {count} {count === 1 ? "ítem" : "ítems"}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Cargar horas de ítems">
            <Button
              size="small"
              onClick={async () => {
                try {
                  setHoursLoading(true);
                  const res = await vesselItemService.list({
                    page: 0,
                    size: 1000,
                    vesselId: record.id,
                  });
                  setHoursItems(res.content ?? []);
                  setHoursVesselId(record.id);
                  setHoursActiveTab("form");
                  setHoursInitialReport(null);
                  // Cargar historial completo y filtrar localmente
                  const all = allHistoryRows.length
                    ? allHistoryRows
                    : await loadHistoryAll(historyPageSize);
                  if (!allHistoryRows.length) setAllHistoryRows(all);
                  const filtered = all.filter((r) => r.vesselId === record.id);
                  setHoursHistoryRows(filtered);
                } catch (e) {
                  await showAlert(
                    "Error al cargar ítems",
                    (e as Error)?.message || "No se pudieron cargar los ítems",
                    "error",
                  );
                } finally {
                  setHoursLoading(false);
                }
              }}
            >
              Cargar horas
            </Button>
          </Tooltip>
          <Tooltip title="Ver historial de cargas de horas">
            <Button
              size="small"
              type="text"
              onClick={async () => {
                setHistoryVesselId(record.id);
                setHistoryPage(0);
                // Si ya tenemos historial completo cargado, reusar; si no, cargar todo
                let all = allHistoryRows;
                if (!allHistoryRows.length) {
                  all = await loadHistoryAll(historyPageSize);
                  setAllHistoryRows(all);
                }
                const filtered = all.filter((r) => r.vesselId === record.id);
                setHistoryRows(filtered);
                setHistoryTotal(filtered.length);
              }}
            >
              Ver historial
            </Button>
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
                await vesselsService.remove(record.id);
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

  const itemColumns: ColumnsType<VesselItem> = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Tipo", dataIndex: "controlType", key: "controlType" },
    { title: "H. acum.", dataIndex: "accumulatedHours", key: "accumulatedHours", width: 100 },
    { title: "Vida útil", dataIndex: "usefulLifeHours", key: "usefulLifeHours", width: 100 },
    { title: "Alerta", dataIndex: "alertHours", key: "alertHours", width: 90 },
    { title: "Material", dataIndex: "materialType", key: "materialType" },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small">
          <Tooltip title="Editar ítem">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentItem(record);
                setShowItemForm(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={async () => {
              try {
                await vesselItemService.remove(record.id);
                setItemsModalData((prev) => prev.filter((x) => x.id !== record.id));
                // También actualizamos el caché general
                setAllItems((prev) => prev.filter((x) => x.id !== record.id));
              } catch (e) {
                await showAlert(
                  "Error al eliminar",
                  (e as Error)?.message || "No se pudo eliminar",
                  "error",
                );
              }
            }}
          >
            <Tooltip title="Eliminar ítem">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const historyColumns: ColumnsType<VesselItemHoursEntry> = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Fecha", dataIndex: "date", key: "date", width: 120 },
    { title: "Responsable", dataIndex: "responsable", key: "responsable", width: 200 },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Ítems",
      key: "itemsCount",
      width: 100,
      render: (_: unknown, record) => (record.items ? record.items.length : 0),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
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
              scroll={{ x: "max-content" }}
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
      >
        <VesselsForm
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

      {/* Modal con ítems asociados al vessel seleccionado */}
      <Modal
        open={itemsManagerVesselId != null}
        title={
          itemsManagerVesselId != null
            ? `Ítems de la embarcación #${itemsManagerVesselId}`
            : "Ítems"
        }
        onCancel={() => {
          setItemsManagerVesselId(null);
          setItemsModalData([]);
          setShowItemForm(false);
          setCurrentItem(null);
        }}
        footer={null}
        width={900}
      >
        <div className="mb-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total: {itemsModalData.length}</span>
            <div className="flex items-center gap-2">
              <Button
                size="small"
                onClick={async () => {
                  const list = await loadAllItems();
                  if (itemsManagerVesselId != null) setFilteredItemsFor(itemsManagerVesselId, list);
                }}
                disabled={itemsModalLoading}
              >
                Actualizar
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setCurrentItem(null);
                  setShowItemForm(true);
                }}
              >
                Agregar ítem
              </Button>
            </div>
          </div>

          {showItemForm && itemsManagerVesselId != null && (
            <div className="rounded-md border border-gray-200 p-3">
              <VesselItemForm
                vesselId={itemsManagerVesselId}
                current={currentItem}
                onSaved={(saved) => {
                  setItemsModalData((prev) => {
                    const exists = prev.some((x) => x.id === saved.id);
                    return exists
                      ? prev.map((x) => (x.id === saved.id ? (saved as VesselItem) : x))
                      : [saved as VesselItem, ...prev];
                  });
                  // también refrescamos el caché general en memoria
                  setAllItems((prev) => {
                    const exists = prev.some((x) => x.id === saved.id);
                    return exists
                      ? prev.map((x) => (x.id === saved.id ? (saved as VesselItem) : x))
                      : [saved as VesselItem, ...prev];
                  });
                  setShowItemForm(false);
                  setCurrentItem(null);
                }}
                onCancel={() => {
                  setShowItemForm(false);
                  setCurrentItem(null);
                }}
              />
            </div>
          )}

          {/* Se removió carga de horas aquí para separar responsabilidades */}

          <Table
            size="small"
            rowKey="id"
            columns={itemColumns}
            dataSource={itemsModalData}
            loading={itemsModalLoading}
            pagination={false}
          />
        </div>
      </Modal>

      {/* Modal independiente para cargar horas desde la lista */}
      <Modal
        open={hoursVesselId != null}
        title={
          hoursVesselId != null ? `Cargar horas – Embarcación #${hoursVesselId}` : "Cargar horas"
        }
        onCancel={() => {
          setHoursVesselId(null);
          setHoursItems([]);
          setHoursInitialReport(null);
        }}
        footer={null}
        width={900}
        confirmLoading={hoursLoading}
      >
        {hoursVesselId != null && (
          <div className="rounded-md border border-gray-200 p-3">
            <Tabs
              activeKey={hoursActiveTab}
              onChange={(k) => setHoursActiveTab(k as "form" | "history")}
              items={[
                {
                  key: "form",
                  label: hoursInitialReport ? "Editar reporte" : "Cargar horas",
                  children: (
                    <VesselItemHoursForm
                      vesselId={hoursVesselId}
                      items={hoursItems}
                      initial={
                        hoursInitialReport
                          ? {
                              id: hoursInitialReport.id,
                              date: hoursInitialReport.date,
                              description: hoursInitialReport.description,
                              items: hoursInitialReport.items,
                            }
                          : null
                      }
                      onSaved={(updated) => {
                        setHoursItems(updated);
                        // Refresca el caché general en memoria
                        setAllItems((prev) => {
                          const map = new Map(prev.map((x) => [x.id, x] as const));
                          for (const u of updated) map.set(u.id, u);
                          return Array.from(map.values());
                        });
                        // Refrescar historial local filtrado sin cerrar modal
                        const all = allHistoryRows.length ? allHistoryRows : [];
                        if (all.length && hoursVesselId != null) {
                          const filtered = all.filter((r) => r.vesselId === hoursVesselId);
                          setHoursHistoryRows(filtered);
                        }
                        setHoursInitialReport(null);
                        setHoursActiveTab("history");
                      }}
                      onCancel={() => {
                        setHoursInitialReport(null);
                      }}
                    />
                  ),
                },
                {
                  key: "history",
                  label: "Historial",
                  children: (
                    <Table
                      size="small"
                      rowKey="id"
                      columns={historyColumns.concat([
                        {
                          title: "Acciones",
                          key: "actions",
                          width: 120,
                          render: (_: unknown, record: VesselItemHoursEntry) => (
                            <Button
                              size="small"
                              onClick={() => {
                                setHoursInitialReport(record);
                                setHoursActiveTab("form");
                              }}
                            >
                              Editar
                            </Button>
                          ),
                        },
                      ])}
                      dataSource={hoursHistoryRows}
                      loading={historyLoading}
                      expandable={{
                        expandedRowRender: (record) => {
                          const itemCols: ColumnsType<{
                            vesselItemId: number;
                            addedHours: number;
                          }> = [
                            {
                              title: "Ítem",
                              key: "itemName",
                              render: (_: unknown, r) => {
                                const name = allItems.find((it) => it.id === r.vesselItemId)?.name;
                                return name ?? `#${r.vesselItemId}`;
                              },
                              width: 240,
                            },
                            {
                              title: "Horas agregadas",
                              dataIndex: "addedHours",
                              key: "addedHours",
                              width: 160,
                            },
                          ];
                          return (
                            <Table
                              size="small"
                              rowKey={(r) => `${record.id}-${r.vesselItemId}`}
                              columns={itemCols}
                              dataSource={record.items || []}
                              pagination={false}
                              scroll={{ x: "max-content" }}
                            />
                          );
                        },
                        rowExpandable: (record) =>
                          Array.isArray(record.items) && record.items.length > 0,
                      }}
                      pagination={{
                        current: historyPage + 1,
                        pageSize: historyPageSize,
                        total: hoursHistoryRows.length,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50],
                        onChange: (page, pageSize) => {
                          setHistoryPage(page - 1);
                          setHistoryPageSize(pageSize);
                        },
                      }}
                      scroll={{ x: "max-content" }}
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Modal para ver historial de cargas de horas */}
      <Modal
        open={historyVesselId != null}
        title={
          historyVesselId != null
            ? `Historial de horas – Embarcación #${historyVesselId}`
            : "Historial de horas"
        }
        onCancel={() => {
          setHistoryVesselId(null);
          setHistoryRows([]);
        }}
        footer={null}
        width={900}
      >
        <Table
          size="small"
          rowKey="id"
          columns={historyColumns}
          dataSource={historyRows}
          loading={historyLoading}
          expandable={{
            expandedRowRender: (record) => {
              const itemCols: ColumnsType<{ vesselItemId: number; addedHours: number }> = [
                {
                  title: "Ítem",
                  key: "itemName",
                  render: (_: unknown, r) => {
                    const name = allItems.find((it) => it.id === r.vesselItemId)?.name;
                    return name ?? `#${r.vesselItemId}`;
                  },
                  width: 240,
                },
                {
                  title: "Horas agregadas",
                  dataIndex: "addedHours",
                  key: "addedHours",
                  width: 160,
                },
              ];
              return (
                <Table
                  size="small"
                  rowKey={(r) => `${record.id}-${r.vesselItemId}`}
                  columns={itemCols}
                  dataSource={record.items || []}
                  pagination={false}
                  scroll={{ x: "max-content" }}
                />
              );
            },
            rowExpandable: (record) => Array.isArray(record.items) && record.items.length > 0,
          }}
          pagination={{
            current: historyPage + 1,
            pageSize: historyPageSize,
            total: historyTotal,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: (page, pageSize) => {
              setHistoryPage(page - 1);
              setHistoryPageSize(pageSize);
              // Paginación local sobre historyRows, sin refetch
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Modal>
    </main>
  );
}

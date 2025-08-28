"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { vesselsService, type Vessel } from "@/features/vessels";
import VesselsForm from "@/features/vessels/components/VesselsForm";
import { showAlert } from "@/utils/showAlert";
import { vesselItemService } from "@/features/vessels";
import type { VesselItem } from "@/features/vessels";
import VesselItemForm from "@/features/vessels/components/VesselItemForm";

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
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Ver ítems">
            <Button
              size="small"
              type="text"
              onClick={() => {
                setItemsManagerVesselId(record.id);
                // La carga real se hará en el effect; aquí solo abrimos el modal con el id
              }}
            >
              Ítems
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
    </main>
  );
}

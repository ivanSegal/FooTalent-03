"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  type MantenimientoFormValues,
  MantenimientoForm,
  MantenimientoList,
  mantenimientoService,
  type MaintenanceListItem,
} from "@/features/maintenance";
import { Modal } from "antd";
import type { NormalizedApiError } from "@/types/api";
import { showAlert, showAutoAlert } from "@/utils/showAlert";

export default function MantenimientoPage() {
  const [items, setItems] = useState<MaintenanceListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<MaintenanceListItem | null>(null);
  const [viewing, setViewing] = useState<MaintenanceListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mantenimientoService.list({ page: 0, size: 50 });
      setItems(res.content);
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

  async function handleSubmit(values: MantenimientoFormValues) {
    try {
      if (editing?.id) {
        const updated = await mantenimientoService.update(editing.id, values);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        showAutoAlert("Actualizado", `Orden #${updated.id} actualizada`, "success");
      } else {
        const created = await mantenimientoService.create(values);
        setItems((prev) => [created, ...prev]);
        showAutoAlert("Creado", `Orden #${created.id} creada`, "success");
      }
      setEditing(null);
    } catch (e) {
      const err = e as NormalizedApiError;
      await showAlert("Error", err?.message || "No se pudo guardar la orden", "error");
    }
  }

  function handleCancel() {
    setEditing(null);
    setViewing(null);
  }

  async function handleDelete(item: MaintenanceListItem) {
    try {
      await mantenimientoService.remove(item.id);
      showAutoAlert("Eliminado", `Orden #${item.id} eliminada`, "success");
      await load();
    } catch (e) {
      const err = e as NormalizedApiError;
      await showAlert("Error", err?.message || `No se pudo eliminar #${item.id}`, "error");
    } finally {
      if (editing?.id === item.id) setEditing(null);
      if (viewing?.id === item.id) setViewing(null);
    }
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
          <MantenimientoList
            items={items}
            onSelect={(itm) => setViewing(itm)}
            onView={(itm) => setViewing(itm)}
            onEdit={(itm) => setEditing(itm)}
            onDelete={handleDelete}
            onCreate={() => setEditing({} as MaintenanceListItem)}
          />
          {loading && <p className="text-xs text-gray-500">Cargando...</p>}
        </section>
      </div>
      <Modal
        open={!!editing}
        title={editing?.id ? `Editar #${editing.id}` : editing ? "Nueva orden" : ""}
        onCancel={handleCancel}
        footer={null}
      >
        {editing && (
          <MantenimientoForm
            initialValues={{
              vesselName: editing.vesselName || "",
              maintenanceReason: editing.maintenanceReason ?? "",
              maintenanceManager: editing.maintenanceManager ?? "",
              maintenanceType: editing.maintenanceType ?? "PREVENTIVO",
              status: editing.status ?? "SOLICITADO",
              issuedAt: editing.issuedAt ?? null,
              scheduledAt: editing.scheduledAt ?? null,
              startedAt: editing.startedAt ?? null,
              finishedAt: editing.finishedAt ?? null,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Modal>
      <Modal
        open={!!viewing}
        title={viewing ? `Detalle #${viewing.id}` : ""}
        onCancel={handleCancel}
        footer={null}
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">
                {viewing.maintenanceReason || viewing.maintenanceType}
              </p>
              <p className="text-gray-500">Embarcación: {viewing.vesselName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Responsable</span>
                <p className="font-medium text-gray-800">{viewing.maintenanceManager || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Estado</span>
                <p className="font-medium text-gray-800 capitalize">
                  {(viewing.status || "").replace(/_/g, " ") || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Emitido</span>
                <p className="font-medium text-gray-800">{viewing.issuedAt || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Programado</span>
                <p className="font-medium text-gray-800">{viewing.scheduledAt || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Inicio</span>
                <p className="font-medium text-gray-800">{viewing.startedAt || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Fin</span>
                <p className="font-medium text-gray-800">{viewing.finishedAt || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

"use client";
import React, { useState } from "react";
import {
  MantenimientoList,
  type MantenimientoItem,
} from "@/components/mantenimiento/MantenimientoList";
import {
  MantenimientoForm,
  type MantenimientoFormValues,
} from "@/components/mantenimiento/MantenimientoForm";
import { Modal, message } from "antd";

// Mock inicial (luego se reemplazará por fetch a la API)
const initialData: MantenimientoItem[] = [
  {
    id: 1,
    embarcacion: "Lancha 1",
    tarea: "Cambio de aceite",
    responsable: "Juan Pérez",
    fechaProgramada: "2025-08-25",
    estado: "pendiente",
    costo: 120,
  },
  {
    id: 2,
    embarcacion: "Lancha 2",
    tarea: "Revisión motor",
    responsable: "Ana Gómez",
    fechaProgramada: "2025-08-27",
    estado: "en_progreso",
    costo: 340,
  },
  {
    id: 3,
    embarcacion: "Lancha 3",
    tarea: "Sustitución filtro combustible",
    responsable: "Carlos Ruiz",
    fechaProgramada: "2025-08-30",
    estado: "completado",
    fechaReal: "2025-08-18",
    costo: 80,
  },
];

export default function MantenimientoPage() {
  const [items, setItems] = useState<MantenimientoItem[]>(initialData);
  const [editing, setEditing] = useState<MantenimientoItem | null>(null);
  const [viewing, setViewing] = useState<MantenimientoItem | null>(null);

  function handleSubmit(values: MantenimientoFormValues) {
    if (values.id) {
      // update
      setItems((prev) => prev.map((i) => (i.id === values.id ? { ...i, ...values } : i)));
    } else {
      const nextId = Math.max(0, ...items.map((i) => i.id)) + 1;
      setItems((prev) => [...prev, { ...values, id: nextId } as MantenimientoItem]);
    }
    setEditing(null);
  }

  function handleCancel() {
    setEditing(null);
    setViewing(null);
  }

  function handleDelete(item: MantenimientoItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    message.success(`Mantenimiento #${item.id} eliminado`);
    if (editing?.id === item.id) setEditing(null);
    if (viewing?.id === item.id) setViewing(null);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mantenimientos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestión y registro de órdenes de mantenimiento preventivo y correctivo.
            </p>
          </div>
          {/* Botón eliminado: ahora se usa el botón dentro de la cabecera de la tabla */}
        </header>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Listado</h2>
          <MantenimientoList
            items={items}
            onSelect={(itm) => setViewing(itm)}
            onView={(itm) => setViewing(itm)}
            onEdit={(itm) => setEditing(itm)}
            onDelete={handleDelete}
            onCreate={() => setEditing({} as MantenimientoItem)}
          />
        </section>
      </div>
      <Modal
        open={!!editing}
        title={editing?.id ? `Editar #${editing.id}` : editing ? "Nuevo mantenimiento" : ""}
        onCancel={handleCancel}
        footer={null}
      >
        {editing && (
          <MantenimientoForm
            initialValues={editing}
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
              <p className="font-medium text-gray-800">{viewing.tarea}</p>
              <p className="text-gray-500">Embarcación: {viewing.embarcacion}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Responsable</span>
                <p className="font-medium text-gray-800">{viewing.responsable || "—"}</p>
              </div>
              <div>
                <span className="text-gray-500">Estado</span>
                <p className="font-medium text-gray-800 capitalize">
                  {viewing.estado?.replace(/_/g, " ") || "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Fecha Programada</span>
                <p className="font-medium text-gray-800">
                  {viewing.fechaProgramada
                    ? new Date(viewing.fechaProgramada).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Fecha Real</span>
                <p className="font-medium text-gray-800">
                  {viewing.fechaReal ? new Date(viewing.fechaReal).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Costo</span>
                <p className="font-medium text-gray-800">
                  {typeof viewing.costo === "number"
                    ? new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "USD",
                      }).format(viewing.costo)
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

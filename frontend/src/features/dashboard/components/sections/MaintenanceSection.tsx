"use client";

import React, { useMemo, useCallback } from "react";
import type { MaintenanceMetrics } from "@/features/dashboard/lib/maintenance.metrics";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  MaintenanceIcon,
  ServiceTicketIcon,
  PieChartIcon,
  BarChartIcon,
  CheckCircleIcon,
} from "@/components/icons/AppIcons";

interface Props {
  metrics: MaintenanceMetrics;
}

export default function MaintenanceSection({ metrics }: Props) {
  // const topStatuses = metrics.topStatuses; // se mantiene por compatibilidad (no usado)
  const allStatuses = metrics.statuses;
  const lastFinished = metrics.lastFinishedActivityByVesselItem.slice(0, 6);
  const byType = metrics.historicalByType;
  const openOrders = metrics.openOrders.slice(0, 6);

  // Mapeo de estatus a etiquetas legibles
  const STATUS_LABELS = useMemo(
    () => ({
      SOLICITADO: "Solicitado",
      EN_PROCESO: "En proceso",
      ESPERANDO_INSUMOS: "Esperando insumos",
      FINALIZADO: "Finalizado",
      ANULADO: "Anulado",
      RECHAZADO: "Rechazado",
    }),
    [],
  );

  const formatStatus = useCallback(
    (s?: string) => {
      if (!s) return "N/D";
      const key = String(s).toUpperCase().trim();
      if (STATUS_LABELS[key as keyof typeof STATUS_LABELS])
        return STATUS_LABELS[key as keyof typeof STATUS_LABELS];
      return key
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    },
    [STATUS_LABELS],
  );

  // Charts data
  const donutData = useMemo(() => {
    const labels = allStatuses.map((s) => formatStatus(s.status));
    const data = allStatuses.map((s) => s.count);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"],
          borderWidth: 0,
        },
      ],
    };
  }, [allStatuses, formatStatus]);

  const donutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" as const } },
      cutout: "60%",
    }),
    [],
  );

  const barData = useMemo(() => {
    const labels = byType.map((t) => t.type);
    const data = byType.map((t) => t.count);
    const backgroundColor = byType.map((t) => {
      const key = String(t.type || "").toUpperCase();
      if (key === "PREVENTIVO") return "#22c55e"; // verde
      if (key === "CORRECTIVO") return "#ef4444"; // rojo
      return "#0ea5e9"; // fallback
    });
    return {
      labels,
      datasets: [
        {
          label: "Órdenes",
          data,
          backgroundColor,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 40,
        },
      ],
    };
  }, [byType]);

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    }),
    [],
  );

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <MaintenanceIcon className="h-5 w-5 text-[color:var(--color-primary-500)]" />
          Mantenimiento
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* All statuses (chart) */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <PieChartIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Estatus (todos)
          </h3>
          <div className="h-56">
            {allStatuses.length > 0 ? (
              <Doughnut data={donutData} options={donutOptions} />
            ) : (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>

        {/* Historical by type (chart) */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChartIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Histórico por tipo
          </h3>
          <div className="h-56">
            {byType.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>

        {/* Last finished activity by vessel item */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <CheckCircleIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Última actividad finalizada
          </h3>
          <ul className="divide-y divide-gray-100">
            {lastFinished.map((a) => (
              <li
                key={`${a.vesselItemId}-${a.maintenanceOrderId}`}
                className="py-2 text-sm first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {a.vesselItemName || `Ítem #${a.vesselItemId}`}
                  </span>
                  <span className="text-gray-900">{a.finishedAt || "Sin fecha"}</span>
                </div>
                <p className="truncate text-xs text-gray-500">{a.maintenanceType}</p>
              </li>
            ))}
            {lastFinished.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Open orders list */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <ServiceTicketIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Órdenes abiertas
          </h3>
          <ul className="divide-y divide-gray-100">
            {openOrders.map((o) => (
              <li key={o.id} className="py-2 text-sm first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {o.vesselName} · {o.maintenanceType}
                  </span>
                  <span className="text-gray-900">{formatStatus(o.status)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {o.startedAt || o.scheduledAt || o.issuedAt || "Sin fecha"}
                </p>
              </li>
            ))}
            {openOrders.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

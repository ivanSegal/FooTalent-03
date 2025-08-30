"use client";

import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import type { ServiceTicketTravel } from "@/features/service-ticket/types/serviceTicketTravel.types";
import {
  ServiceTicketIcon,
  PieChartIcon,
  ShippingIcon,
  HistoryIcon,
} from "@/components/icons/AppIcons";

// Minimal shape for metrics to avoid tight coupling
// and avoid `any` types while allowing extra fields
interface OpenLinkedItem {
  id?: number;
  title?: string;
  vesselName?: string;
}

type ServiceTicketMetricsShape = {
  byStatus: Record<string, number>;
  byVessel: Array<{ vesselId: number; vesselName?: string; count: number }>;
  openLinkedToVessels: OpenLinkedItem[];
};

interface TicketTravels {
  ticketId: number;
  title?: string;
  vesselName?: string;
  travels: ServiceTicketTravel[];
}

interface Props {
  metrics: ServiceTicketMetricsShape;
  travels: TicketTravels[];
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4 text-gray-400"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServiceTicketsSection({ metrics, travels }: Props) {
  const statusEntries = Object.entries(metrics.byStatus).sort((a, b) => b[1] - a[1]);
  const topVessels = metrics.byVessel.slice(0, 5);
  const openLinked = metrics.openLinkedToVessels.slice(0, 6);

  // Formatear estatus (EN_PROCESO -> En Proceso)
  const formatStatus = useCallback((s: string) => {
    return String(s)
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, []);

  const donutData = useMemo(() => {
    const labels = statusEntries.map(([status]) => formatStatus(status));
    const data = statusEntries.map(([, count]) => count);
    const palette = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];
    const backgroundColor = labels.map((_, i) => palette[i % palette.length]);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };
  }, [statusEntries, formatStatus]);

  const donutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" as const } },
      cutout: "60%",
    }),
    [],
  );

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <ServiceTicketIcon className="h-5 w-5 text-[color:var(--color-primary-500)]" />
          Boletas de servicio
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Por estado (gráfico) */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-gray-700">
            <PieChartIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Por estado
          </h3>
          <div className="h-56">
            {statusEntries.length > 0 ? (
              <Doughnut data={donutData} options={donutOptions} />
            ) : (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>

        {/* Boletas por embarcación */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-gray-700">
            <ShippingIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Boletas por embarcación
          </h3>
          <ul className="space-y-2">
            {topVessels.map((v, idx) => (
              <li
                key={`${v.vesselId || "unknown"}-${idx}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate text-gray-600">
                  {v.vesselName || `Embarcación #${v.vesselId}`}
                </span>
                <span className="font-medium text-gray-900">{v.count}</span>
              </li>
            ))}
            {topVessels.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Abiertas vinculadas a embarcaciones */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-gray-700">
            <ServiceTicketIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Abiertas vinculadas a embarcaciones
          </h3>
          <ul className="divide-y divide-gray-100">
            {openLinked.map((t, idx) => {
              const id = t.id ?? 0;
              const vesselName = t.vesselName ?? "";
              const title = t.title ?? "Ticket";
              return (
                <li
                  key={`ticket-${id || "unknown"}-${idx}`}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    {vesselName && <p className="text-xs text-gray-500">{vesselName}</p>}
                  </div>
                  <span className="text-xs text-gray-400">#{id}</span>
                </li>
              );
            })}
            {openLinked.length === 0 && <li className="py-1 text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Viajes de boletas */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-12">
          <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-gray-700">
            <HistoryIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Viajes de boletas
          </h3>
          {travels.length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {travels.map((t) => (
                <motion.div
                  key={t.ticketId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-md border border-gray-100 p-3 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t.title || `Boleta #${t.ticketId}`}
                      </p>
                      {t.vesselName && <p className="text-xs text-gray-500">{t.vesselName}</p>}
                    </div>
                    <span className="text-xs text-gray-400">#{t.ticketId}</span>
                  </div>

                  <ul className="space-y-2">
                    {t.travels.map((tr) => (
                      <li key={tr.id} className="text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-gray-700">
                            <span className="font-medium">{tr.origin}</span>
                            <ArrowIcon />
                            <span className="font-medium">{tr.destination}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-gray-700">
                            <ClockGlyph />
                            <span>
                              {tr.departureTime}–{tr.arrivalTime}
                            </span>
                          </span>
                          {tr.totalTraveledTime && (
                            <span className="inline-flex items-center gap-1 rounded bg-gray-50 px-2 py-0.5 text-gray-700">
                              <ClockGlyph />
                              <span>Total {tr.totalTraveledTime}</span>
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

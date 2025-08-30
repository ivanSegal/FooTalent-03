"use client";

import React from "react";
import type { VesselMetrics } from "@/features/dashboard/lib/vessels.metrics";
import { ShippingIcon } from "@/components/icons/AppIcons";

// Icono de alerta
function WarningIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M10.29 3.86c.86-1.49 2.56-1.49 3.42 0l7.54 13.07c.86 1.49-.21 3.37-1.71 3.37H4.46c-1.5 0-2.57-1.88-1.71-3.37L10.29 3.86zM12 8a1 1 0 00-1 1v4a1 1 0 102 0V9a1 1 0 00-1-1zm0 8a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

// Icono de reloj para "Horas diarias"
function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm1-10.59V7a1 1 0 10-2 0v5a1 1 0 00.29.71l3 3a1 1 0 001.42-1.42L13 11.41z" />
    </svg>
  );
}

// Icono de navegación para "Horas de navegación"
function NavigationIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 8.5l-4.2 1.7-1.7 4.2 4.2-1.7 1.7-4.2z" />
    </svg>
  );
}

interface Props {
  metrics: VesselMetrics;
}

export default function VesselsSection({ metrics }: Props) {
  const recentDaily = metrics.dailyHoursByVessel.slice(0, 8);
  const nearAlert = metrics.itemsNearAlert.slice(0, 6);
  const navTop = metrics.navigationSummary.slice(0, 5);

  // Mapa auxiliar para obtener el nombre de la embarcación por id
  const vesselNameById = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const v of metrics.navigationSummary) {
      if (v.vesselId) map.set(v.vesselId, v.vesselName);
    }
    return map;
  }, [metrics.navigationSummary]);

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <ShippingIcon className="h-5 w-5 text-[color:var(--color-primary-500)]" />
          Embarcaciones
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Daily hours by vessel */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-6 flex items-center justify-center gap-2 text-base font-semibold text-gray-900">
            <ClockIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
            Horas diarias (recientes)
          </h3>
          <ul className="divide-y divide-gray-100">
            {recentDaily.map((r) => {
              const vesselLabel = vesselNameById.get(r.vesselId)
                ? `${vesselNameById.get(r.vesselId)} (Embarcación #${r.vesselId})`
                : `Embarcación #${r.vesselId}`;
              return (
                <li key={`${r.vesselId}-${r.date}`} className="py-2 text-sm first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    {/* Mostrar nombre y id cuando esté disponible */}
                    <span className="text-gray-600">{vesselLabel}</span>
                    <span className="text-gray-900">{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.hours} h</p>
                </li>
              );
            })}
            {recentDaily.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Items near alert */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-6 flex items-center justify-center gap-2 text-base font-semibold text-gray-900">
            <WarningIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
            Ítems próximos a alerta
          </h3>
          <ul className="divide-y divide-gray-100">
            {nearAlert.map((it) => {
              const isBelowThreshold =
                Number(it.accumulatedHours ?? 0) < Number(it.alertHours ?? 0);
              const valueClass = isBelowThreshold ? "font-medium text-red-600" : "text-gray-900";
              const vesselLabel = vesselNameById.get(it.vesselId)
                ? `${vesselNameById.get(it.vesselId)} (Embarcación #${it.vesselId})`
                : `Embarcación #${it.vesselId}`;
              return (
                <li key={it.vesselItemId} className="py-2 text-sm first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      {it.name || `Ítem #${it.vesselItemId}`}
                    </span>
                    <div className="flex items-center">
                      <span className={valueClass}>
                        {it.accumulatedHours}/{it.alertHours} h
                      </span>
                      {isBelowThreshold && (
                        <span className="ml-2 inline-flex animate-pulse items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          <WarningIcon className="h-3 w-3" /> Atención
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{vesselLabel}</p>
                </li>
              );
            })}
            {nearAlert.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Navigation summary */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-4">
          <h3 className="mb-6 flex items-center justify-center gap-2 text-base font-semibold text-gray-900">
            <ClockIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
            Horas de navegación
          </h3>
          <ul className="divide-y divide-gray-100">
            {navTop.map((v) => {
              const vesselLabel = v.vesselName
                ? `${v.vesselName} (Embarcación #${v.vesselId})`
                : `Embarcación #${v.vesselId}`;
              return (
                <li key={v.vesselId} className="py-4 text-sm first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">{vesselLabel}</span>
                    <span className="font-medium text-gray-900">{v.navigationHours} h</span>
                  </div>
                </li>
              );
            })}
            {navTop.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

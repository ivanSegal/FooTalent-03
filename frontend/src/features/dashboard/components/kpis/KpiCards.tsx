"use client";

import React from "react";
import type { DashboardTotals } from "@/features/dashboard/hooks/useDashboard";
import {
  ShippingIcon,
  MaintenanceIcon,
  ServiceTicketIcon,
  InventoryIcon,
} from "@/components/icons/AppIcons";

interface Props {
  totals: DashboardTotals;
}

export default function KpiCards({ totals }: Props) {
  const cards = [
    {
      title: "Estado de Flota",
      items: [
        { label: "Operativas", value: totals.operativas, color: "text-green-600" },
        { label: "En mantenimiento", value: totals.enMantenimiento, color: "text-amber-600" },
        { label: "Fuera de servicio", value: totals.fueraDeServicio, color: "text-slate-700" },
      ],
      iconColor: "text-indigo-600",
      icon: <ShippingIcon className="h-6 w-6" />,
    },
    {
      title: "Órdenes de Mantenimiento",
      items: [
        { label: "Finalizadas", value: totals.maintenanceFinished, color: "text-emerald-600" },
        { label: "Otras", value: totals.maintenanceOthers, color: "text-slate-700" },
        { label: "Preventivo", value: totals.maintenancePreventive, color: "text-blue-600" },
      ],
      iconColor: "text-indigo-600",
      icon: <MaintenanceIcon className="h-6 w-6" />,
    },
    {
      title: "Boletas de Servicio",
      items: [
        { label: "Totales", value: totals.totalServiceTickets, color: "text-slate-700" },
        { label: "Abiertas", value: totals.openServiceTickets, color: "text-rose-600" },
        {
          label: "Viajes realizados",
          value: totals.totalServiceTicketTravels,
          color: "text-sky-600",
        },
      ],
      iconColor: "text-indigo-600",
      icon: <ServiceTicketIcon className="h-6 w-6" />,
    },
    {
      title: "Avisos de Inventario",
      items: [
        { label: "Stock bajo", value: totals.lowStock, color: "text-amber-600" },
        { label: "Sin stock", value: totals.outOfStock, color: "text-red-600" },
        {
          label: "Salidas (unidades)",
          value: totals.inventoryOutboundUnits,
          color: "text-sky-600",
        },
      ],
      iconColor: "text-indigo-600",
      icon: <InventoryIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {cards.map((c, idx) => (
        <section key={idx} className="col-span-1 rounded-lg bg-white p-4 shadow md:col-span-3">
          <header className="mb-4 flex items-center gap-2">
            <span className={`inline-flex h-8 w-8 items-center justify-center ${c.iconColor}`}>
              {c.icon}
            </span>
            <h2 className="text-xl leading-7 font-medium text-[color:var(--color-primary-500)]">
              {c.title}
            </h2>
          </header>
          <ol className="space-y-2 text-sm leading-5 font-normal text-[color:var(--color-primary-500)]/70">
            {c.items.map((it) => (
              <li key={it.label} className="flex items-start justify-between gap-3">
                <span className="truncate">{it.label}</span>
                <span className={`font-medium ${it.color}`}>{it.value}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

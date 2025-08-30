"use client";

import React from "react";
import type { MaintenanceListItem } from "@/features/maintenance";

interface Props {
  items: MaintenanceListItem[];
}

export default function LastMaintenances({ items }: Props) {
  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-8">
      <header className="mb-6 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Últimos mantenimientos registrados</h2>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-[#304C7D] px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#3d5e9b] focus:ring-2 focus:ring-[#304C7D] focus:ring-offset-2 focus:outline-none"
        >
          Ver todos
        </button>
      </header>
      <ul className="divide-y divide-gray-200">
        {items.map((m) => (
          <li key={m.id} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
            <div className="pr-4">
              <p className="text-sm font-medium text-gray-900">{m.vesselName}</p>
              <p className="text-sm text-gray-500">{m.maintenanceReason ?? m.maintenanceType}</p>
            </div>
            <p className="text-sm font-medium whitespace-nowrap text-gray-900">
              {m.finishedAt ?? m.scheduledAt ?? m.issuedAt ?? "-"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

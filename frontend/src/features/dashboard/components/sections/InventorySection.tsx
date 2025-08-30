"use client";

import React from "react";
import type { InventoryMetrics } from "@/features/dashboard/lib/inventory.metrics";
import {
  InventoryIcon,
  WarningTriangleIcon,
  XCircleIcon,
  BarChartIcon,
  HistoryIcon,
} from "@/components/icons/AppIcons";

interface Props {
  metrics: InventoryMetrics;
}

export default function InventorySection({ metrics }: Props) {
  const topOutbound = metrics.mostOutboundItems.slice(0, 5);
  const recent = metrics.recentMovements.slice(0, 6);
  const lowItems = metrics.lowStockItems.slice(0, 5);
  const zeroItems = metrics.outOfStockItems.slice(0, 5);

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <InventoryIcon className="h-5 w-5 text-[color:var(--color-primary-500)]" />
          Inventario
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* KPIs */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-3">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <WarningTriangleIcon className="h-4 w-4 text-amber-500" />
            Stock bajo
            {metrics.lowStockCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                {metrics.lowStockCount}
              </span>
            )}
          </p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.lowStockCount}</p>
          {/* Lista breve de ítems en stock bajo */}
          <ul className="mt-3 space-y-1">
            {lowItems.map((it) => (
              <li key={it.itemWarehouseId} className="text-xs text-gray-600">
                <span className="font-medium text-gray-800">{it.itemWarehouseName}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-500">{it.warehouseName}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-500">
                  {it.stock}/{it.stockMin}
                </span>
              </li>
            ))}
            {lowItems.length === 0 && <li className="text-xs text-gray-400">Sin detalles</li>}
          </ul>
        </div>
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-3">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <XCircleIcon className="h-4 w-4 text-red-500" />
            Sin stock
          </p>
          <p className="text-2xl font-semibold text-gray-900">{metrics.outOfStockCount}</p>
          {/* Lista breve de ítems sin stock */}
          <ul className="mt-3 space-y-1">
            {zeroItems.map((it) => (
              <li key={it.itemWarehouseId} className="text-xs text-gray-600">
                <span className="font-medium text-gray-800">{it.itemWarehouseName}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-500">{it.warehouseName}</span>
                <span className="mx-1">·</span>
                <span className="text-gray-500">{it.stockMin}</span>
              </li>
            ))}
            {zeroItems.length === 0 && <li className="text-xs text-gray-400">Sin detalles</li>}
          </ul>
        </div>

        {/* Top outbound items */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-3">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChartIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Ítems con más salidas
          </h3>
          <ul className="space-y-2">
            {topOutbound.map((i) => (
              <li key={i.itemWarehouseId} className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-600">{i.itemWarehouseName}</span>
                <span className="font-medium text-gray-900">{i.totalOut}</span>
              </li>
            ))}
            {topOutbound.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>

        {/* Recent movements */}
        <div className="col-span-1 rounded-md border border-gray-100 p-4 md:col-span-3">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <HistoryIcon className="h-4 w-4 text-[color:var(--color-primary-500)]" />
            Movimientos recientes
          </h3>
          <ul className="divide-y divide-gray-100">
            {recent.map((m) => (
              <li key={String(m.id)} className="py-2 text-sm first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{m.movementType}</span>
                  <span className="text-gray-900">
                    {new Date(String(m.date)).toLocaleDateString()}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500">
                  {m.movementDetails
                    ?.map((d) => `${d.itemWarehouseName} (${d.quantity})`)
                    .join(", ")}
                </p>
              </li>
            ))}
            {recent.length === 0 && <li className="text-sm text-gray-400">Sin datos</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

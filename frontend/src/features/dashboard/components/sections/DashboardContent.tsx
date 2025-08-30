"use client";

import React from "react";
import {
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
  Chart as ChartJS,
} from "chart.js";
import KpiCards from "@/features/dashboard/components/kpis/KpiCards";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import ServiceTicketsSection from "@/features/dashboard/components/sections/ServiceTicketsSection";
import InventorySection from "@/features/dashboard/components/sections/InventorySection";
import MaintenanceSection from "@/features/dashboard/components/sections/MaintenanceSection";
import VesselsSection from "@/features/dashboard/components/sections/VesselsSection";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
);

export default function DashboardContent() {
  const { data, isLoading, isError, refetchAll } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Cargando panel…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-600">No fue posible cargar el panel.</p>
        <button
          onClick={() => void refetchAll()}
          className="mt-4 rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-[color:var(--color-primary-500)]">Dashboard</h1>

      {/* Row 1: KPIs */}
      <KpiCards totals={data.totals} />

      {/* Domain sections */}
      <div className="mt-6 space-y-6">
        <VesselsSection metrics={data.metrics.vessels} />
        <MaintenanceSection metrics={data.metrics.maintenance} />
        <InventorySection metrics={data.metrics.inventory} />
        <ServiceTicketsSection
          metrics={data.metrics.serviceTicket}
          travels={data.lists.serviceTicketTravels}
        />
      </div>
    </main>
  );
}

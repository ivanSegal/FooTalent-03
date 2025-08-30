"use client";

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { WeeklyUsageChart } from "@/features/dashboard/hooks/useDashboard";

interface Props {
  weekly: WeeklyUsageChart;
}

export default function WeeklyUsageBar({ weekly }: Props) {
  const data = useMemo(
    () => ({
      labels: weekly.labels,
      datasets: [
        {
          label: "Horas",
          data: weekly.data,
          backgroundColor: "#667eea",
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 40,
        },
      ],
    }),
    [weekly],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 }, color: "#374151" },
        },
        y: {
          beginAtZero: true,
          ticks: { display: false },
          grid: { color: "#e5e7eb", drawBorder: false },
        },
      },
    }),
    [],
  );

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-4">
      <header className="mb-4">
        <h2 className="text-2xl leading-7 font-semibold text-gray-900">Prestación de Servicios</h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Horas por día de la última quincena
        </p>
      </header>
      <div className="h-64" role="img" aria-label="Horas por día">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

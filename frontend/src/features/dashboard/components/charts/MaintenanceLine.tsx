"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";

interface Props {
  labels: string[];
  real: number[];
  budget: number[];
  totalLastSix: number;
}

export default function MaintenanceLine({ labels, real, budget, totalLastSix }: Props) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Costo Real",
          data: real,
          borderColor: "#059669",
          spanGaps: true,
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: "Costo Presupuestado",
          data: budget,
          borderColor: "#2563eb",
          spanGaps: true,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    }),
    [labels, real, budget],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          position: "top" as const,
          align: "end" as const,
          labels: { font: { size: 16 } },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#374151",
          bodyColor: "#111827",
          borderColor: "#e5e7eb",
          borderWidth: 1,
        },
      },
      scales: { x: {}, y: { display: false, beginAtZero: true } },
    }),
    [],
  );

  return (
    <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
      <header className="mb-4">
        <h2 className="text-2xl leading-7 font-medium text-[color:var(--color-primary-500)]">
          Frecuencias de Mantenimiento
        </h2>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(totalLastSix)}
        </p>
        <p className="text-sm font-normal text-[color:var(--color-primary-500)]/70">
          Costo total (Últimos 6 meses)
        </p>
      </header>
      <div className="h-40 w-full" aria-label="Gráfico de líneas de costos" role="img">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import Sidebar from "../sidebar/sidebar";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  BarElement,
);

export default function DashboardPage() {
  // Etiquetas de los 12 meses del año
  const yearLabels = useMemo(
    () => ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    [],
  );

  // Datos anuales ajustados para simular ondas suaves y un cruce (junio) similar al ejemplo visual.
  const real = useMemo(() => [500, 650, 400, 680, 1000, 1080, 1000, 500, 1050, 800, 980, 1000], []);
  const presup = useMemo(() => [900, 1150, 1000, 1200, 820, 510, 750, 880, 600, 620, 750, 880], []);

  // Datos uso embarcaciones (frecuencias por día semana)
  const diasLabels = useMemo(() => ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"], []);
  const usoEmbarcaciones = useMemo(() => [8, 6, 6, 10, 7, 6, 3], []);

  // Últimos mantenimientos (mock)
  const mantenimientos = useMemo(
    () => [
      { id: 1, embarcacion: "Lancha 6", tarea: "Cambio de filtro de aceite", costo: 2000 },
      { id: 2, embarcacion: "Lancha 6", tarea: "Cambio de filtro de aceite", costo: 2000 },
      { id: 3, embarcacion: "Lancha 6", tarea: "Cambio de filtro de aceite", costo: 2000 },
    ],
    [],
  );

  // Total solo de los últimos 6 meses (más recientes)
  const totalRealUltimosSeis = useMemo(() => real.slice(-6).reduce((a, b) => a + b, 0), [real]);

  // Datos y opciones para react-chartjs-2
  const chartData = useMemo(
    () => ({
      labels: yearLabels,
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
          data: presup,
          borderColor: "#2563eb",
          spanGaps: true,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    }),
    [yearLabels, real, presup],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          position: "top" as const,
          align: "end" as const,
          labels: {
            font: { size: 16 },
          },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#374151",
          bodyColor: "#111827",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          callbacks: {
            label: (ctx: import("chart.js").TooltipItem<"line">) => {
              const formatter = new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              });
              return `${ctx.dataset.label}: ${formatter.format(Number(ctx.parsed.y))}`;
            },
            title: (items: import("chart.js").TooltipItem<"line">[]) => items[0].label || "",
          },
        },
      },
      scales: {
        x: {},
        y: { display: false, beginAtZero: true },
      },
    }),
    [],
  );

  const usoData = useMemo(
    () => ({
      labels: diasLabels,
      datasets: [
        {
          label: "Uso",
          data: usoEmbarcaciones,
          backgroundColor: "#667eea",
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 40,
        },
      ],
    }),
    [diasLabels, usoEmbarcaciones],
  );

  const usoOptions = useMemo(
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
    <>
    <Sidebar />
    <main className="min-h-screen bg-gray-50 p-8 ml-16">
      <h1 className="mb-6 text-3xl font-bold text-[color:var(--color-primary-500)]">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Row 1: 3 cards of 4 columns */}
        <section className="col-span-1 rounded-lg bg-white p-4 shadow md:col-span-4">
          <header className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center text-blue-600">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="-m-[2px] h-[25px] w-[25px]"
              >
                <path
                  d="M21.2708 12.8854C22.1771 13.25 22.7396 14.3229 22.5312 15.2708L22.1042 17.2083C21.3646 20.5416 18.75 22.9166 14.9792 22.9166H10.0208C6.24998 22.9166 3.6354 20.5416 2.89582 17.2083L2.46873 15.2708C2.2604 14.3229 2.82289 13.25 3.72914 12.8854L5.20832 12.2916L10.9479 9.98956C11.9479 9.59373 13.0521 9.59373 14.0521 9.98956L19.7917 12.2916L21.2708 12.8854Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 22.9167V10.4167"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.7917 8.33334V12.2917L14.0521 9.98959C13.0521 9.59376 11.9479 9.59376 10.9479 9.98959L5.20834 12.2917V8.33334C5.20834 6.61459 6.61459 5.20834 8.33334 5.20834H16.6667C18.3854 5.20834 19.7917 6.61459 19.7917 8.33334Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.1042 5.20834H9.89584V3.12501C9.89584 2.55209 10.3646 2.08334 10.9375 2.08334H14.0625C14.6354 2.08334 15.1042 2.55209 15.1042 3.12501V5.20834Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="text-2xl leading-7 font-medium text-[color:var(--color-primary-500)]">
              Estado de Flota
            </h2>
          </header>
          <ol className="space-y-2 text-sm leading-5 font-normal text-[color:var(--color-primary-500)]/70">
            <li className="flex items-start gap-3">
              <span>10 Operativas</span>
            </li>
            <li className="flex items-start gap-3">
              <span>2 En mantenimiento</span>
            </li>
          </ol>
        </section>
        <section className="col-span-1 rounded-lg bg-white p-4 shadow md:col-span-4">
          <header className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center text-[color:var(--color-tertiary-500]">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="h-[25px] w-[25px]"
              >
                <path
                  d="M3 6.77083C3 8.78437 4.567 10.4167 6.5 10.4167C6.91256 10.4167 7.30845 10.3423 7.67599 10.2058L14.2025 17.0042C14.0714 17.387 14 17.7994 14 18.2292C14 20.2427 15.567 21.875 17.5 21.875C17.8475 21.875 18.1831 21.8223 18.5 21.724L17 18.75L18 17.7083L20.8551 19.2708C20.9494 18.9408 21 18.5911 21 18.2292C21 16.2156 19.433 14.5833 17.5 14.5833L17.4799 14.5834C16.7564 14.5876 16.3946 14.5897 16.2391 14.5384C16.1655 14.5141 16.1585 14.5111 16.0898 14.4753C15.9446 14.3995 15.7982 14.247 15.5055 13.9421L15.5055 13.9421L9.79741 7.99617C9.92858 7.61322 10 7.20071 10 6.77083C10 4.7573 8.433 3.125 6.5 3.125C6.15251 3.125 5.81685 3.17775 5.5 3.27598L7 6.25L6 7.29167L3.14494 5.72917C3.05064 6.05922 3 6.40887 3 6.77083Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="text-2xl leading-7 font-medium text-[color:var(--color-primary-500)]">
              Órdenes en Proceso
            </h2>
          </header>
          <ol className="space-y-2 text-sm leading-5 font-normal text-[color:var(--color-primary-500)]/70">
            <li className="flex items-start gap-3">
              <span>15 completadas</span>
            </li>
            <li className="flex items-start gap-3">
              <span>8 en proceso</span>
            </li>
          </ol>
        </section>
        <section className="col-span-1 rounded-lg bg-white p-4 shadow md:col-span-4">
          <header className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center text-red-500">
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="h-[25px] w-[24px]"
              >
                <path
                  d="M19.2743 15.1L15.1174 7.9C13.8968 5.78589 13.2865 4.72884 12.4155 4.54371C12.1414 4.48543 11.8581 4.48543 11.5839 4.54371C10.7129 4.72884 10.1026 5.78589 8.88204 7.9L8.88203 7.9L4.72511 15.1C3.50453 17.2141 2.89424 18.2712 3.16941 19.118C3.25602 19.3846 3.39769 19.63 3.58523 19.8383C4.18107 20.5 5.40165 20.5 7.8428 20.5H16.1566C18.5978 20.5 19.8184 20.5 20.4142 19.8383C20.6018 19.63 20.7434 19.3846 20.83 19.118C21.1052 18.2712 20.4949 17.2141 19.2743 15.1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17Z"
                  fill="currentColor"
                />
                <path
                  d="M12 13.75V10.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h2 className="text-2xl leading-7 font-medium text-[color:var(--color-primary-500)]">
              Avisos
            </h2>
          </header>
          <ol className="space-y-2 text-sm leading-5 font-normal text-[color:var(--color-primary-500)]/70">
            <li className="flex items-start gap-3">
              <span>2 repuestos con stock bajo</span>
            </li>
            <li className="flex items-start gap-3">
              <span>1 repuesto sin stock</span>
            </li>
          </ol>
        </section>
        {/* Row 2: single 12-column card */}
        <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-12">
          <header className="mb-4">
            <h2 className="text-2xl leading-7 font-medium text-[color:var(--color-primary-500]">
              Frecuencias de Mantenimiento
            </h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(totalRealUltimosSeis)}
            </p>
            <p className="text-sm font-normal text-[color:var(--color-primary-500)]/70">
              Costo total (Últimos 6 meses)
            </p>
          </header>
          <div
            className="h-40 w-full"
            aria-label="Gráfico de líneas de costos de mantenimiento"
            role="img"
          >
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>
        {/* Row 3: 8-column + 4-column */}
        <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-8">
          <header className="mb-6 flex items-start justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Últimos mantenimientos registrados
            </h2>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[#304C7D] px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#3d5e9b] focus:ring-2 focus:ring-[#304C7D] focus:ring-offset-2 focus:outline-none"
            >
              Ver todos
            </button>
          </header>
          <ul className="divide-y divide-gray-200">
            {mantenimientos.map((m) => (
              <li key={m.id} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                <div className="pr-4">
                  <p className="text-sm font-medium text-gray-900">{m.embarcacion}</p>
                  <p className="text-sm text-gray-500">{m.tarea}</p>
                </div>
                <p className="text-sm font-medium whitespace-nowrap text-gray-900">
                  {new Intl.NumberFormat("es-ES")
                    .format(m.costo)
                    .replace(/,/g, ".")
                    .replace(" ", " ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="col-span-1 rounded-lg bg-white p-6 shadow md:col-span-4">
          <header className="mb-4">
            <h2 className="text-2xl leading-7 font-semibold text-gray-900">
              Prestación de Servicios
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Frecuencias de Uso de Embarcaciones
            </p>
          </header>
          <div className="h-64" aria-label="Frecuencia de uso de embarcaciones" role="img">
            <Bar data={usoData} options={usoOptions} />
          </div>
        </section>
      </div>
    </main>
    </>
    
  );
}

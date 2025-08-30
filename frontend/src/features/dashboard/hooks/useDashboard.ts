"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { vesselsService } from "@/features/vessels/services/vessels.service";
import { maintenanceService } from "@/features/maintenance/services/maintenance.service";
import { serviceTicketService } from "@/features/service-ticket/services/serviceTicket.service";
import { inventoryStockService } from "@/features/inventory-items/services/inventoryStock.service";
import { vesselItemHoursService } from "@/features/vessels/services/vesselItemHours.service";
import inventoryMovementService from "@/features/inventory-items/services/inventoryMovement.service";
import type { MaintenanceListItem } from "@/features/maintenance";
import { buildServiceTicketMetrics } from "@/features/dashboard/lib/serviceTicket.metrics";
import { buildInventoryMetrics } from "@/features/dashboard/lib/inventory.metrics";
import { buildMaintenanceMetrics } from "@/features/dashboard/lib/maintenance.metrics";
import { buildVesselMetrics } from "@/features/dashboard/lib/vessels.metrics";
import vesselItemService from "@/features/vessels/services/vesselItem.service";
import { serviceTicketDetailService } from "@/features/service-ticket/services/serviceTicketDetail.service";
import { serviceTicketTravelService } from "@/features/service-ticket/services/serviceTicketTravel.service";
import type { ServiceTicketTravel } from "@/features/service-ticket/types/serviceTicketTravel.types";

export interface DashboardTotals {
  totalVessels: number;
  operativas: number;
  enMantenimiento: number;
  fueraDeServicio: number;
  totalMaintenanceOrders: number;
  maintenancePreventive: number;
  maintenanceCorrective: number;
  maintenanceFinished: number;
  maintenanceOthers: number;
  totalServiceTickets: number;
  openServiceTickets: number; // abiertas
  // Total de viajes realizados (suma de viajes de las boletas consideradas en el dashboard)
  totalServiceTicketTravels: number;
  // Unidades totales salidas (suma de cantidades en movimientos tipo SALIDA)
  inventoryOutboundUnits: number;
  lowStock: number; // stock <= stockMin
  outOfStock: number; // stock === 0
}

export interface WeeklyUsageChart {
  labels: string[]; // ["Lun", "Mar", ...]
  data: number[]; // length 7
}

export interface DashboardCharts {
  weeklyUsage: WeeklyUsageChart;
  monthlyReal: number[]; // 12 length, fallback mock
  monthlyBudget: number[]; // 12 length, fallback mock
}

export interface DashboardLists {
  lastMaintenances: MaintenanceListItem[];
  serviceTicketTravels: Array<{
    ticketId: number;
    title?: string;
    vesselName?: string;
    travels: ServiceTicketTravel[];
  }>;
}

export interface UseDashboardResult {
  data: {
    totals: DashboardTotals;
    charts: DashboardCharts;
    lists: DashboardLists;
    metrics: {
      serviceTicket: ReturnType<typeof buildServiceTicketMetrics>;
      inventory: ReturnType<typeof buildInventoryMetrics>;
      maintenance: ReturnType<typeof buildMaintenanceMetrics>;
      vessels: ReturnType<typeof buildVesselMetrics>;
    };
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetchAll: () => Promise<void>;
}

/**
 * Aggregates data for the Dashboard using existing feature endpoints and React Query.
 * Designed to be resilient to partial data and backend variations.
 */
export function useDashboard(): UseDashboardResult {
  const today = dayjs();
  const fromDate = today.subtract(14, "day").format("DD-MM-YYYY");
  const toDate = today.format("DD-MM-YYYY");

  // Vessels
  const vesselsQ = useQuery({
    queryKey: ["vessels", "dashboard", { page: 0, size: 200 }],
    queryFn: () => vesselsService.list({ page: 0, size: 200, sort: "name,asc" }),
    staleTime: 60_000,
  });

  // Maintenance orders (recent)
  const maintQ = useQuery({
    queryKey: ["maintenance", "dashboard", { page: 0, size: 50 }],
    queryFn: () => maintenanceService.list({ page: 0, size: 50, sort: "issuedAt,desc" }),
    staleTime: 30_000,
  });

  // Service tickets
  const ticketsQ = useQuery({
    queryKey: ["service-tickets", "dashboard", { page: 0, size: 200 }],
    queryFn: () => serviceTicketService.list({ page: 0, size: 200, sort: "travelDate,desc" }),
    staleTime: 60_000,
  });

  // Inventory stock
  const stockQ = useQuery({
    queryKey: ["inventory-stock", "dashboard", { page: 0, size: 500 }],
    queryFn: () => inventoryStockService.list({ page: 0, size: 500, sort: "stock,asc" }),
    staleTime: 60_000,
  });

  // Inventory movements
  const movementsQ = useQuery({
    queryKey: ["inventory-movement", "dashboard", { page: 0, size: 200 }],
    queryFn: () => inventoryMovementService.list({ page: 0, size: 200, sort: "date,desc" }),
    staleTime: 60_000,
  });

  // Vessel item hours
  const hoursQ = useQuery({
    queryKey: ["vessel-item-hours", "dashboard", { page: 0, size: 200, fromDate, toDate }],
    queryFn: () =>
      vesselItemHoursService.list({ page: 0, size: 200, fromDate, toDate, sort: "date,asc" }),
    staleTime: 30_000,
  });

  // Vessel items
  const vesselItemsQ = useQuery({
    queryKey: ["vessel-items", "dashboard", { page: 0, size: 200 }],
    queryFn: () => vesselItemService.list({ page: 0, size: 200, sort: "name,asc" }),
    staleTime: 60_000,
  });

  // Derive top open ticket IDs (máx 5) para viajes
  const openTopIds = useMemo(() => {
    const m = buildServiceTicketMetrics(ticketsQ.data);
    return m.openLinkedToVessels
      .slice(0, 5)
      .map((t) => Number((t as unknown as { id?: number }).id ?? 0))
      .filter((n) => n > 0);
  }, [ticketsQ.data]);

  // Travels by ticket (para mostrar viajes recientes por boleta)
  const travelsQ = useQuery({
    queryKey: ["ticket-travels", { openTopIds }],
    enabled: openTopIds.length > 0,
    staleTime: 30_000,
    queryFn: async () => {
      const metrics = buildServiceTicketMetrics(ticketsQ.data);
      const openTop = metrics.openLinkedToVessels.slice(0, 5);
      const results = await Promise.all(
        openTop.map(async (t) => {
          const ticketId = Number((t as unknown as { id?: number }).id ?? 0);
          const title = String((t as unknown as { title?: string }).title ?? "");
          const vesselName = String((t as unknown as { vesselName?: string }).vesselName ?? "");
          if (!ticketId)
            return {
              ticketId: 0,
              title,
              vesselName,
              travels: [] as ServiceTicketTravel[],
            };
          const detail = await serviceTicketDetailService.getOneByServiceTicket(ticketId);
          if (!detail) return { ticketId, title, vesselName, travels: [] as ServiceTicketTravel[] };
          const travels = await serviceTicketTravelService.listByDetail(detail.id);
          return { ticketId, title, vesselName, travels };
        }),
      );
      return results.filter((r) => r.ticketId > 0);
    },
  });

  // Total de viajes realizados en todas las boletas listadas (suma de todos los detalles)
  const travelsTotalQ = useQuery({
    queryKey: [
      "ticket-travels-count-total",
      {
        ids: (ticketsQ.data?.content ?? [])
          .map((t) => Number((t as unknown as { id?: number }).id ?? 0))
          .filter((n) => n > 0),
      },
    ],
    enabled: (ticketsQ.data?.content?.length ?? 0) > 0,
    staleTime: 30_000,
    queryFn: async () => {
      const content = ticketsQ.data?.content ?? [];
      const detailLists = await Promise.all(
        content.map(async (t) => {
          const id = Number((t as unknown as { id?: number }).id ?? 0);
          if (!id) return [] as Array<{ id: number }>;
          return serviceTicketDetailService.listByServiceTicket(id);
        }),
      );
      const details = detailLists.flat();
      const travelsLists = await Promise.all(
        details.map((d) => serviceTicketTravelService.listByDetail((d as { id: number }).id)),
      );
      const total = travelsLists.reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
      return total;
    },
  });

  const isLoading =
    vesselsQ.isLoading ||
    maintQ.isLoading ||
    ticketsQ.isLoading ||
    stockQ.isLoading ||
    movementsQ.isLoading ||
    hoursQ.isLoading ||
    vesselItemsQ.isLoading;
  const isError =
    vesselsQ.isError ||
    maintQ.isError ||
    ticketsQ.isError ||
    stockQ.isError ||
    movementsQ.isError ||
    hoursQ.isError ||
    vesselItemsQ.isError;
  const error =
    vesselsQ.error ||
    maintQ.error ||
    ticketsQ.error ||
    stockQ.error ||
    movementsQ.error ||
    hoursQ.error ||
    vesselItemsQ.error;

  const data = useMemo(() => {
    if (
      !vesselsQ.data ||
      !maintQ.data ||
      !ticketsQ.data ||
      !stockQ.data ||
      !movementsQ.data ||
      !hoursQ.data ||
      !vesselItemsQ.data
    ) {
      return null;
    }

    // Totals and status approximation
    const totalVessels = vesselsQ.data.totalElements ?? vesselsQ.data.content?.length ?? 0;
    let operativas = 0;
    let enMantenimiento = 0;
    let fueraDeServicio = 0;
    for (const v of vesselsQ.data.content ?? []) {
      const status = String((v as unknown as { status?: string }).status ?? "").toUpperCase();
      if (["OPERATIONAL", "OPERATIVA", "OPERATIVE", "ACTIVE"].includes(status)) operativas++;
      else if (
        ["UNDER_MAINTENANCE", "EN_MANTENIMIENTO", "MAINTENANCE", "IN_MAINTENANCE"].includes(status)
      )
        enMantenimiento++;
      else if (["OUT_OF_SERVICE", "FUERA_DE_SERVICIO", "INACTIVE"].includes(status))
        fueraDeServicio++;
    }

    // Maintenance orders
    const totalMaintenanceOrders = maintQ.data.totalElements ?? maintQ.data.content.length ?? 0;
    const lastMaintenances = (maintQ.data.content ?? []).slice(0, 6);

    // Service tickets total
    const totalServiceTickets = ticketsQ.data.totalElements ?? ticketsQ.data.content.length ?? 0;

    // Inventory stock KPIs
    let lowStock = 0;
    let outOfStock = 0;
    for (const row of stockQ.data.content ?? []) {
      const stock = Number(row.stock ?? 0);
      const stockMin = Number(row.stockMin ?? 0);
      if (stock === 0) outOfStock++;
      if (stock <= stockMin) lowStock++;
    }

    // Weekly usage
    const weekLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const weekly = new Array(7).fill(0) as number[];
    for (const entry of hoursQ.data.content ?? []) {
      const d = dayjs(entry.date);
      const dow = d.day();
      const idx = dow === 0 ? 6 : dow - 1;
      const sumHours = Array.isArray(entry.items)
        ? entry.items.reduce((acc, it) => acc + Number(it.addedHours ?? 0), 0)
        : 0;
      weekly[idx] += sumHours;
    }

    // Fallback monthly series (mock)
    const monthlyReal = [500, 650, 400, 680, 1000, 1080, 1000, 500, 1050, 800, 980, 1000];
    const monthlyBudget = [900, 1150, 1000, 1200, 820, 510, 750, 880, 600, 620, 750, 880];

    // Metrics
    const serviceTicketMetrics = buildServiceTicketMetrics(ticketsQ.data);
    const inventoryMetrics = buildInventoryMetrics(stockQ.data, movementsQ.data);
    const maintenanceMetrics = buildMaintenanceMetrics(maintQ.data);
    const vesselMetrics = buildVesselMetrics(vesselsQ.data, hoursQ.data, vesselItemsQ.data);

    const openServiceTickets = serviceTicketMetrics.openLinkedToVessels.length;

    // Maintenance breakdown (filtrar anuladas/rechazadas y clasificar)
    const maintItems = maintQ.data.content ?? [];
    const canceledSet = new Set([
      "ANULADA",
      "ANULADO",
      "CANCELADA",
      "CANCELADO",
      "CANCELLED",
      "RECHAZADA",
      "RECHAZADO",
      "REJECTED",
    ]);
    const finishedSet = new Set([
      "FINALIZADA",
      "FINALIZADO",
      "TERMINADA",
      "COMPLETED",
      "FINISHED",
      "CLOSED",
    ]);
    const validMaint = maintItems.filter(
      (it) => !canceledSet.has(String(it.status ?? "").toUpperCase()),
    );
    const maintenanceFinished = validMaint.filter((it) => {
      const st = String(it.status ?? "").toUpperCase();
      return finishedSet.has(st) && Boolean(it.finishedAt);
    }).length;
    const maintenanceOthers = Math.max(0, validMaint.length - maintenanceFinished);
    const maintenancePreventive = validMaint.filter((it) =>
      ["PREVENTIVO", "PREVENTIVE"].includes(String(it.maintenanceType ?? "").toUpperCase()),
    ).length;
    const maintenanceCorrective = validMaint.filter((it) =>
      ["CORRECTIVO", "CORRECTIVE"].includes(String(it.maintenanceType ?? "").toUpperCase()),
    ).length;

    // Total unidades salidas en inventario (a partir de métricas ya calculadas)
    const inventoryOutboundUnits = inventoryMetrics.mostOutboundItems.reduce(
      (acc, it) => acc + Number(it.totalOut ?? 0),
      0,
    );

    return {
      totals: {
        totalVessels,
        operativas,
        enMantenimiento,
        fueraDeServicio,
        totalMaintenanceOrders,
        maintenancePreventive,
        maintenanceCorrective,
        maintenanceFinished,
        maintenanceOthers,
        totalServiceTickets,
        openServiceTickets,
        totalServiceTicketTravels: Number(travelsTotalQ.data ?? 0),
        inventoryOutboundUnits,
        lowStock,
        outOfStock,
      },
      charts: {
        weeklyUsage: { labels: weekLabels, data: weekly },
        monthlyReal,
        monthlyBudget,
      },
      lists: {
        lastMaintenances,
        serviceTicketTravels: travelsQ.data ?? [],
      },
      metrics: {
        serviceTicket: serviceTicketMetrics,
        inventory: inventoryMetrics,
        maintenance: maintenanceMetrics,
        vessels: vesselMetrics,
      },
    };
  }, [
    vesselsQ.data,
    maintQ.data,
    ticketsQ.data,
    stockQ.data,
    movementsQ.data,
    hoursQ.data,
    vesselItemsQ.data,
    travelsQ.data,
    travelsTotalQ.data,
  ]);

  const refetchAll = async () => {
    await Promise.all([
      vesselsQ.refetch(),
      maintQ.refetch(),
      ticketsQ.refetch(),
      stockQ.refetch(),
      movementsQ.refetch(),
      hoursQ.refetch(),
      vesselItemsQ.refetch(),
    ]);
  };

  return { data, isLoading, isError, error, refetchAll };
}

export default useDashboard;

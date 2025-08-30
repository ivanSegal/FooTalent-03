import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import LogoLogin from "@/assets/images/logo-incacore.svg";
import type { MaintenanceActivityItem } from "../types/maintenanceActivities.types";

// Registrar la fuente "DM Sans" desde archivos locales para evitar errores de formato/CORS
let dmSansRegistered = false;
try {
  if (!dmSansRegistered) {
    Font.register({
      family: "DM Sans",
      fonts: [
        { src: "/fonts/dmsans/DMSans-Regular.ttf", fontWeight: "normal" },
        { src: "/fonts/dmsans/DMSans-Medium.ttf", fontWeight: 500 },
        { src: "/fonts/dmsans/DMSans-Bold.ttf", fontWeight: "bold" },
      ],
    });
    dmSansRegistered = true;
  }
} catch {
  // noop: si falla la carga, el renderer usará la fuente por defecto
}

export interface MaintenanceData {
  id?: number;
  vesselName: string;
  maintenanceType?: string;
  status?: string;
  maintenanceReason?: string | null;
  maintenanceManager?: string | null;
  issuedAt?: string | null;
  scheduledAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontSize: 10,
    fontFamily: "DM Sans",
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
    paddingBottom: 6,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 36, height: 36, marginRight: 8 },
  headerText: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "left",
  },
  subtitle: { fontSize: 9, color: "#666", marginTop: 2 },
  section: { marginTop: 8, marginBottom: 6 },
  sectionTitle: {
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 3,
    fontWeight: "bold",
    fontSize: 10,
    color: "#222",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e6effa",
  },
  rowFirst: { borderTopWidth: 0 },
  label: {
    flex: 1,
    padding: 4,
    fontWeight: "bold",
    color: "#333",
  },
  value: { flex: 2, padding: 4, color: "#222" },
  tableBox: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 6,
    backgroundColor: "#fafdff",
    overflow: "hidden",
  },
  sectionTitleBar: {
    backgroundColor: "#e3f2fd",
    padding: 4,
    fontWeight: "bold",
    fontSize: 10,
    color: "#1e3a8a",
    borderBottomWidth: 1,
    borderBottomColor: "#bbdefb",
  },
  // Contenedor principal del contenido para empujar las firmas al pie
  content: {
    flexGrow: 1,
  },
  signatures: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Tres firmas en una fila
  signatureBox: { width: "32%", alignItems: "center" },
  signatureLabel: { fontSize: 9, fontWeight: "bold", marginTop: 8, textAlign: "center" },
  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    marginTop: 24,
  },
  signatureCaption: { fontSize: 8, color: "#64748b", marginTop: 6, textAlign: "center" },
  // Estilos para resaltar el cumplimiento
  analysisValuePositive: { color: "#16a34a" },
  analysisValueNegative: { color: "#dc2626" },
  analysisValueNeutral: { color: "#334155" },
  // Actividades
  activitiesHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e6effa",
  },
  activitiesHeaderCell: { padding: 4, fontWeight: "bold", color: "#333" },
  activitiesRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e6effa" },
  activitiesCell: { padding: 4, color: "#222" },
});

const safe = (v?: string | number | null) => {
  return v === undefined || v === null || v === "" ? "—" : String(v);
};

export const MaintenanceTemplate: React.FC<{
  data: MaintenanceData;
  logoSrc?: string;
  activities?: MaintenanceActivityItem[];
}> = ({ data, logoSrc, activities }) => {
  dayjs.extend(customParseFormat);
  const parse = (s?: string | null) => (s ? dayjs(s, "DD-MM-YYYY", true) : undefined);
  const diffDays = (a?: string | null, b?: string | null) => {
    const da = parse(a);
    const db = parse(b);
    if (!da || !db || !da.isValid() || !db.isValid()) return undefined;
    return db.diff(da, "day");
  };
  const fmtDays = (n?: number) =>
    typeof n === "number" ? `${Math.abs(n)} día${Math.abs(n) === 1 ? "" : "s"}` : "—";

  // Determina el logo a usar: prioridad al prop, sino el logo fijo del proyecto
  // La importación de una imagen en Next puede ser un string (ruta) o un objeto con { src }
  const logoDefault: string =
    typeof (LogoLogin as unknown) === "string"
      ? (LogoLogin as unknown as string)
      : (LogoLogin as { src?: string }).src || "/logo-incacore.svg";
  const rows: { label: string; value: string }[] = [
    { label: "ID", value: safe(data.id) },
    { label: "Embarcación", value: safe(data.vesselName) },
    { label: "Tipo", value: safe(data.maintenanceType) },
    { label: "Estado", value: safe(data.status) },
    { label: "Responsable", value: safe(data.maintenanceManager) },
  ];
  const dates: { label: string; value: string }[] = [
    { label: "Emitido", value: safe(data.issuedAt) },
    { label: "Programado", value: safe(data.scheduledAt) },
    { label: "Inicio", value: safe(data.startedAt) },
    { label: "Fin", value: safe(data.finishedAt) },
  ];

  // Análisis de tiempos
  const leadProgramacion = diffDays(data.issuedAt, data.scheduledAt); // emisión -> programación
  const deltaInicioVsProgramado = diffDays(data.scheduledAt, data.startedAt); // + retraso, - adelanto
  const duracionEjecucion = diffDays(data.startedAt, data.finishedAt); // inicio -> fin
  const tiempoTotal = diffDays(data.issuedAt, data.finishedAt); // emisión -> fin

  let cumplimientoTxt = "—";
  let cumplimientoStyle = styles.analysisValueNeutral;
  if (typeof deltaInicioVsProgramado === "number") {
    if (deltaInicioVsProgramado > 0) {
      cumplimientoTxt = `Retraso de ${fmtDays(deltaInicioVsProgramado)}`;
      cumplimientoStyle = styles.analysisValueNegative;
    } else if (deltaInicioVsProgramado < 0) {
      cumplimientoTxt = `Adelanto de ${fmtDays(deltaInicioVsProgramado)}`;
      cumplimientoStyle = styles.analysisValuePositive;
    } else {
      cumplimientoTxt = "A tiempo";
      cumplimientoStyle = styles.analysisValueNeutral;
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src={logoSrc || logoDefault} />
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {`Orden de Mantenimiento${data.id ? ` #${data.id}` : ""}`}
            </Text>
            <Text style={styles.subtitle}>{`Embarcación: ${safe(data.vesselName)}`}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.tableBox}>
              <Text style={styles.sectionTitleBar}>Datos</Text>
              {rows.map((r, idx) => (
                <View key={r.label} style={[styles.row, idx === 0 ? styles.rowFirst : {}]}>
                  <Text style={styles.label}>{r.label}</Text>
                  <Text style={styles.value}>{r.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.tableBox}>
              <Text style={styles.sectionTitleBar}>Motivo</Text>
              <View style={[styles.row, styles.rowFirst]}>
                <Text style={styles.value}>{safe(data.maintenanceReason)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.tableBox}>
              <Text style={styles.sectionTitleBar}>Fechas</Text>
              {dates.map((r, idx) => (
                <View key={r.label} style={[styles.row, idx === 0 ? styles.rowFirst : {}]}>
                  <Text style={styles.label}>{r.label}</Text>
                  <Text style={styles.value}>{r.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Actividades */}
          {Array.isArray(activities) && activities.length > 0 && (
            <View style={styles.section}>
              <View style={styles.tableBox}>
                <Text style={styles.sectionTitleBar}>Actividades</Text>
                <View style={[styles.activitiesHeaderRow]}>
                  <Text style={[styles.activitiesHeaderCell, { flex: 0.6 }]}>ID</Text>
                  <Text style={[styles.activitiesHeaderCell, { flex: 1 }]}>Tipo</Text>
                  <Text style={[styles.activitiesHeaderCell, { flex: 1.2 }]}>Ítem</Text>
                  <Text style={[styles.activitiesHeaderCell, { flex: 2 }]}>Descripción</Text>
                  <Text style={[styles.activitiesHeaderCell, { flex: 1.4 }]}>Movimientos</Text>
                </View>
                {activities.map((a, idx) => (
                  <View key={a.id ?? idx} style={[styles.activitiesRow, idx === 0 ? {} : {}]}>
                    <Text style={[styles.activitiesCell, { flex: 0.6 }]}>{safe(a.id)}</Text>
                    <Text style={[styles.activitiesCell, { flex: 1 }]}>{safe(a.activityType)}</Text>
                    <Text style={[styles.activitiesCell, { flex: 1.2 }]}>
                      {a.vesselItemName ? a.vesselItemName : `#${safe(a.vesselItemId)}`}
                    </Text>
                    <Text style={[styles.activitiesCell, { flex: 2 }]}>{safe(a.description)}</Text>
                    <Text style={[styles.activitiesCell, { flex: 1.4 }]}>
                      {Array.isArray(a.inventoryMovementIds) && a.inventoryMovementIds.length
                        ? `[${a.inventoryMovementIds.join(", ")}]`
                        : "—"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Análisis de tiempos */}
          <View style={styles.section}>
            <View style={styles.tableBox}>
              <Text style={styles.sectionTitleBar}>Análisis</Text>
              <View style={[styles.row, styles.rowFirst]}>
                <Text style={styles.label}>Antelación de programación</Text>
                <Text style={styles.value}>{fmtDays(leadProgramacion)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cumplimiento de programación</Text>
                <Text style={[styles.value, cumplimientoStyle]}>{cumplimientoTxt}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Duración de la ejecución</Text>
                <Text style={styles.value}>{fmtDays(duracionEjecucion)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tiempo total (emisión a fin)</Text>
                <Text style={styles.value}>{fmtDays(tiempoTotal)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Solicitante</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Nombre y firma</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Responsable</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Nombre y firma</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Supervisor</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Nombre y firma</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MaintenanceTemplate;

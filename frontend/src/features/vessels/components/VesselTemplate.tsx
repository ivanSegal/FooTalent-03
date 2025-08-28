import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import LogoIncacore from "@/assets/images/logo-incacore.svg";
import type { Vessel, VesselItem } from "@/features/vessels";

// Registrar fuente local similar a ServiceTicketTemplate
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
  // noop
}

export interface VesselTemplateData {
  vessel: Vessel;
  items?: VesselItem[];
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
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 36, height: 36, marginRight: 8 },
  headerText: { flex: 1 },
  title: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 2 },
  // caja de info con dos columnas
  headerInfoBox: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 6,
    backgroundColor: "#fafdff",
    overflow: "hidden",
    marginTop: 6,
  },
  gridHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderBottomWidth: 1,
    borderBottomColor: "#bbdefb",
  },
  gridHeaderCellHalf: {
    width: "50%",
    padding: 4,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  row: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e6effa" },
  rowFirst: { borderTopWidth: 0 },
  cellLabel: {
    width: "25%",
    padding: 4,
    fontWeight: "bold",
    color: "#333",
  },
  cellValue: {
    width: "25%",
    padding: 4,
    color: "#222",
  },
  section: { marginTop: 8, marginBottom: 6 },
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderBottomWidth: 1,
    borderBottomColor: "#bbdefb",
  },
  th: { padding: 4, fontWeight: "bold", color: "#1e3a8a" },
  td: { padding: 4, color: "#222" },
  colXs: { width: "8%" },
  colSm: { width: "12%" },
  colMd: { width: "18%" },
  colLg: { width: "24%" },
  colFlex: { flexGrow: 1, width: "26%" },
});

const safe = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? "—" : String(v);

export const VesselTemplate: React.FC<{ data: VesselTemplateData; logoSrc?: string }> = ({
  data,
  logoSrc,
}) => {
  const { vessel, items } = data;

  const logoDefault: string =
    typeof (LogoIncacore as unknown) === "string"
      ? (LogoIncacore as unknown as string)
      : (LogoIncacore as { src?: string }).src || "/logo-incacore.svg";

  const left: { label: string; value: string }[] = [
    { label: "ID", value: safe(vessel.id) },
    { label: "Nombre", value: safe(vessel.name) },
    { label: "Matrícula", value: safe(vessel.registrationNumber) },
    { label: "ISMM", value: safe(vessel.ismm) },
    { label: "Bandera", value: safe(vessel.flagState) },
    { label: "Señal", value: safe(vessel.callSign) },
  ];

  const right: { label: string; value: string }[] = [
    { label: "Puerto", value: safe(vessel.portOfRegistry) },
    { label: "RIF", value: safe(vessel.rif) },
    { label: "Servicio", value: safe(vessel.serviceType) },
    { label: "Material", value: safe(vessel.constructionMaterial) },
    { label: "Popa", value: safe(vessel.sternType) },
    { label: "Combustible", value: safe(vessel.fuelType) },
  ];

  const rows = Math.max(left.length, right.length);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src={logoSrc || logoDefault} />
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {`Ficha de Embarcación${vessel.id ? ` #${vessel.id}` : ""}`}
            </Text>
            <Text style={styles.subtitle}>
              {`Nombre: ${safe(vessel.name)} · Matrícula: ${safe(vessel.registrationNumber)}`}
            </Text>
          </View>
        </View>

        {/* Encabezado con datos en dos columnas */}
        <View style={styles.headerInfoBox}>
          <View style={styles.gridHeaderRow}>
            <Text style={styles.gridHeaderCellHalf}>Datos generales</Text>
            <Text style={styles.gridHeaderCellHalf}>Características</Text>
          </View>
          {Array.from({ length: rows }).map((_, i) => (
            <View key={`hdr-${i}`} style={[styles.row, i === 0 ? styles.rowFirst : {}]}>
              <Text style={styles.cellLabel}>{left[i]?.label ?? ""}</Text>
              <Text style={styles.cellValue}>{left[i]?.value ?? ""}</Text>
              <Text style={styles.cellLabel}>{right[i]?.label ?? ""}</Text>
              <Text style={styles.cellValue}>{right[i]?.value ?? ""}</Text>
            </View>
          ))}
        </View>

        {/* Ítems de la embarcación */}
        {Array.isArray(items) && items.length > 0 && (
          <View style={[styles.section, styles.tableBox]}>
            <Text style={styles.sectionTitleBar}>
              {`Ítems de la embarcación (${items.length})`}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colXs]}>#</Text>
              <Text style={[styles.th, styles.colLg]}>Nombre</Text>
              <Text style={[styles.th, styles.colFlex]}>Descripción</Text>
              <Text style={[styles.th, styles.colMd]}>Tipo control</Text>
              <Text style={[styles.th, styles.colSm]}>H. acum.</Text>
              <Text style={[styles.th, styles.colSm]}>Vida útil</Text>
              <Text style={[styles.th, styles.colSm]}>Alerta</Text>
              <Text style={[styles.th, styles.colMd]}>Material</Text>
            </View>
            {items.map((it, idx) => (
              <View key={it.id ?? idx} style={styles.row}>
                <Text style={[styles.td, styles.colXs]}>{String(idx + 1)}</Text>
                <Text style={[styles.td, styles.colLg]}>{safe(it.name)}</Text>
                <Text style={[styles.td, styles.colFlex]}>{safe(it.description)}</Text>
                <Text style={[styles.td, styles.colMd]}>{safe(it.controlType)}</Text>
                <Text style={[styles.td, styles.colSm]}>{safe(it.accumulatedHours)}</Text>
                <Text style={[styles.td, styles.colSm]}>{safe(it.usefulLifeHours)}</Text>
                <Text style={[styles.td, styles.colSm]}>{safe(it.alertHours)}</Text>
                <Text style={[styles.td, styles.colMd]}>{safe(it.materialType)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Resumen simple */}
        <View style={styles.section}>
          <View style={styles.tableBox}>
            <Text style={styles.sectionTitleBar}>Resumen</Text>
            <View style={[styles.row, styles.rowFirst]}>
              <Text style={styles.cellLabel}>Horas de navegación</Text>
              <Text style={styles.cellValue}>{safe(vessel.navigationHours)}</Text>
              <Text style={styles.cellLabel}></Text>
              <Text style={styles.cellValue}></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default VesselTemplate;

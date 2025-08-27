import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import LogoLogin from "@/assets/images/logo-incacore.svg";
import { ServiceTicketDetail } from "../types/serviceTicketDetail.types";
import { ServiceTicketTravel } from "../types/serviceTicketTravel.types";

// Registrar fuente local como en MaintenanceTemplate
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

export interface ServiceTicketData {
  id?: number;
  travelNro: number;
  travelDate: string;
  vesselAttended: string;
  solicitedBy: string;
  reportTravelNro: string;
  code: string;
  checkingNro: number;
  vesselName: string;
  responsibleUsername: string;
  // extended info
  detail?: ServiceTicketDetail | null;
  travels?: ServiceTicketTravel[];
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
  // two-column header info (single table)
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
  content: { flexGrow: 1 },
  signatures: { marginTop: 18, flexDirection: "row", justifyContent: "space-between" },
  signatureBox: { width: "32%", alignItems: "center" },
  signatureLabel: { fontSize: 9, fontWeight: "bold", marginTop: 8, textAlign: "center" },
  signatureLine: { width: "100%", borderTopWidth: 1, borderTopColor: "#94a3b8", marginTop: 24 },
  signatureCaption: { fontSize: 8, color: "#64748b", marginTop: 6, textAlign: "center" },
  // travels table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderBottomWidth: 1,
    borderBottomColor: "#bbdefb",
  },
  th: { padding: 4, fontWeight: "bold", color: "#1e3a8a" },
  td: { padding: 4, color: "#222" },
  colSmall: { width: "12%" },
  colMedium: { width: "22%" },
  colLarge: { width: "34%" },
});

const safe = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? "—" : String(v);

export const ServiceTicketTemplate: React.FC<{ data: ServiceTicketData; logoSrc?: string }> = ({
  data,
  logoSrc,
}) => {
  const logoDefault: string =
    typeof (LogoLogin as unknown) === "string"
      ? (LogoLogin as unknown as string)
      : (LogoLogin as { src?: string }).src || "/logo-incacore.svg";

  const generalRows: { label: string; value: string }[] = [
    { label: "ID", value: safe(data.id) },
    { label: "N° Viaje", value: safe(data.travelNro) },
    { label: "Fecha de viaje", value: safe(data.travelDate) },
    { label: "Embarcación", value: safe(data.vesselName) },
    { label: "Embarcación atendida", value: safe(data.vesselAttended) },
    { label: "Solicitado por", value: safe(data.solicitedBy) },
    { label: "Responsable", value: safe(data.responsibleUsername) },
    { label: "Código", value: safe(data.code) },
    { label: "N° Control", value: safe(data.checkingNro) },
    { label: "Reporte de viaje", value: safe(data.reportTravelNro) },
  ];

  const detailRows: { label: string; value: string }[] = data.detail
    ? [
        { label: "Área servicio", value: safe(data.detail.serviceArea) },
        { label: "Tipo servicio", value: safe(data.detail.serviceType) },
        { label: "Descripción", value: safe(data.detail.description) },
        { label: "Horas", value: safe(data.detail.hoursTraveled) },
        { label: "Patrón", value: safe(data.detail.patronFullName) },
        { label: "Marinero", value: safe(data.detail.marinerFullName) },
        { label: "Capitán", value: safe(data.detail.captainFullName) },
      ]
    : [];

  const maxRows = Math.max(generalRows.length, detailRows.length);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src={logoSrc || logoDefault} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{`Boleta de Servicio${data.id ? ` #${data.id}` : ""}`}</Text>
            <Text style={styles.subtitle}>{`Embarcación: ${safe(data.vesselName)}`}</Text>
          </View>
        </View>

        {/* Encabezado tipo factura: Datos (izq) y Detalle (der) en una sola tabla */}
        <View style={styles.headerInfoBox}>
          <View style={styles.gridHeaderRow}>
            <Text style={styles.gridHeaderCellHalf}>Datos</Text>
            <Text style={styles.gridHeaderCellHalf}>Detalle del servicio</Text>
          </View>
          {Array.from({ length: maxRows }).map((_, i) => (
            <View key={`hdr-${i}`} style={[styles.row, i === 0 ? styles.rowFirst : {}]}>
              <Text style={styles.cellLabel}>{generalRows[i]?.label ?? ""}</Text>
              <Text style={styles.cellValue}>{generalRows[i]?.value ?? ""}</Text>
              <Text style={styles.cellLabel}>{detailRows[i]?.label ?? ""}</Text>
              <Text style={styles.cellValue}>{detailRows[i]?.value ?? ""}</Text>
            </View>
          ))}
        </View>

        <View style={styles.content}>
          {/* Viajes (items) */}
          {Array.isArray(data.travels) && data.travels.length > 0 && (
            <View style={styles.section}>
              <View style={styles.tableBox}>
                <Text style={styles.sectionTitleBar}>{`Viajes (${data.travels.length})`}</Text>
                {/* Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, styles.colSmall]}>#</Text>
                  <Text style={[styles.th, styles.colLarge]}>Origen</Text>
                  <Text style={[styles.th, styles.colLarge]}>Destino</Text>
                  <Text style={[styles.th, styles.colMedium]}>Salida</Text>
                  <Text style={[styles.th, styles.colMedium]}>Llegada</Text>
                  <Text style={[styles.th, styles.colSmall]}>Total</Text>
                </View>
                {/* Rows */}
                {data.travels.map((t, idx) => (
                  <View key={t.id ?? idx} style={styles.row}>
                    <Text style={[styles.td, styles.colSmall]}>{String(idx + 1)}</Text>
                    <Text style={[styles.td, styles.colLarge]}>{safe(t.origin)}</Text>
                    <Text style={[styles.td, styles.colLarge]}>{safe(t.destination)}</Text>
                    <Text style={[styles.td, styles.colMedium]}>{safe(t.departureTime)}</Text>
                    <Text style={[styles.td, styles.colMedium]}>{safe(t.arrivalTime)}</Text>
                    <Text style={[styles.td, styles.colSmall]}>{safe(t.totalTraveledTime)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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

export default ServiceTicketTemplate;

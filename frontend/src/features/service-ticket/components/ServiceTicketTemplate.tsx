import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import LogoLogin from "@/assets/images/LogoLogin.png";

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
  boatName: string;
  responsibleUsername: string;
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
  title: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 2 },
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
  row: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#e6effa" },
  rowFirst: { borderTopWidth: 0 },
  label: { flex: 1, padding: 4, fontWeight: "bold", color: "#333" },
  value: { flex: 2, padding: 4, color: "#222" },
  content: { flexGrow: 1 },
  signatures: { marginTop: 18, flexDirection: "row", justifyContent: "space-between" },
  signatureBox: { width: "32%", alignItems: "center" },
  signatureLabel: { fontSize: 9, fontWeight: "bold", marginTop: 8, textAlign: "center" },
  signatureLine: { width: "100%", borderTopWidth: 1, borderTopColor: "#94a3b8", marginTop: 24 },
  signatureCaption: { fontSize: 8, color: "#64748b", marginTop: 6, textAlign: "center" },
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
      : (LogoLogin as { src?: string }).src || "/LogoLogin.png";

  const rows: { label: string; value: string }[] = [
    { label: "ID", value: safe(data.id) },
    { label: "N° Viaje", value: safe(data.travelNro) },
    { label: "Fecha de viaje", value: safe(data.travelDate) },
    { label: "Embarcación atendida", value: safe(data.vesselAttended) },
    { label: "Solicitado por", value: safe(data.solicitedBy) },
    { label: "Reporte de viaje", value: safe(data.reportTravelNro) },
    { label: "Código", value: safe(data.code) },
    { label: "N° Control", value: safe(data.checkingNro) },
    { label: "Nombre del barco", value: safe(data.boatName) },
    { label: "Responsable", value: safe(data.responsibleUsername) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src={logoSrc || logoDefault} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{`Boleta de Servicio${data.id ? ` #${data.id}` : ""}`}</Text>
            <Text style={styles.subtitle}>{`Barco: ${safe(data.boatName)}`}</Text>
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
        </View>

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

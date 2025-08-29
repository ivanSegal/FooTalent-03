import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { UserListItem } from "@/features/user/types/user.types";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, backgroundColor: "#fff" },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: 140, fontWeight: "bold", color: "#333" },
  value: { flex: 1, color: "#222" },
});

const safe = (v?: string | null) => (v == null || v === "" ? "—" : v);

export interface UserTemplateData {
  user: UserListItem;
}

export const UserTemplate: React.FC<{ data: UserTemplateData }> = ({ data }) => {
  const u = data.user;
  const name = `${u.firstName} ${u.lastName}`.trim();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{`Usuario${name ? `: ${name}` : ""}`}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{safe(u.id)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{safe(name)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{safe(u.email)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{safe(u.role)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Departamento</Text>
          <Text style={styles.value}>{safe(u.department)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>{safe(u.accountStatus)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default UserTemplate;

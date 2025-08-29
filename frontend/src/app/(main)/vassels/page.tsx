import React from "react";
import { VesselsList } from "@/features/vessels";
import Sidebar from "../sidebar/sidebar";

export default function VasselsPage() {
  return (
    <>
      <Sidebar />
      <VesselsList />;
    </>
  );
}

import React from "react";
import { VasselsList } from "@/features/vassels";
import Sidebar from "../sidebar/sidebar";

export default function VasselsPage() {
  return (
    <>
      <Sidebar />
      <VasselsList />;
    </>
  );
}

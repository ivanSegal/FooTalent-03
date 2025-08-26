import React from "react";
import { Metadata } from "next";
import DashboardPage from "./dashboard/page";
import Sidebar from "./sidebar/sidebar";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "IncaCore - Main Layout",
  description: "IncaCore - Main Layout.",
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo a la izquierda */}
      {/* <aside className="sticky top-0 h-screen shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
        <Sidebar /> 
      </aside> */}

      {/* Contenido ocupa el espacio restante y hace scroll */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

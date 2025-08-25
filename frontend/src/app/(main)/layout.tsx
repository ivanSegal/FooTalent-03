import React from "react";
import { Metadata } from "next";
import Sidebar from "@/app/(main)/sidebar/page";
import DashboardPage from "./dashboard/page";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "IncaCore - Main Layout",
  description: "IncaCore - Main Layout.",
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return (
    <React.Fragment>
      {/* <Navbar /> */}
      <div className="relative">
        <div className="absolute top-0 left-0 h-screen w-64 z-50">
          <Sidebar />
        </div>
        <div className="ml-16 h-screen bg-gray-200">
          <DashboardPage />
          {/* {children} */}
        </div>
      </div>
    </React.Fragment>
  );
}

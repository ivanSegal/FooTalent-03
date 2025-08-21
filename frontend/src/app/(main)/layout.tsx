import React from "react";
import { Metadata } from "next";
import Sidebar from "@/app/(main)/sidebar/page";

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
      <Sidebar />
      {children}
    </React.Fragment>
  );
}

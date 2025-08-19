import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";

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
      <Navbar />
      {children}
    </React.Fragment>
  );
}

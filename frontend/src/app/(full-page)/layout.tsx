import { Metadata } from "next";
import React from "react";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "IncaCore - Full Page Layout",
  description: "IncaCore - Full Page Layout.",
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return <React.Fragment>{children}</React.Fragment>;
}

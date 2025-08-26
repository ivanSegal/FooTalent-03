import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import FondoLogin from "@/assets/images/fondoLogin.png";


interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "IncaCore - Full Page Layout",
  description: "IncaCore - Full Page Layout.",
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src={FondoLogin}
        alt="Fondo"
        fill
        priority
        placeholder="blur"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <div className="relative z-10 flex min-h-screen w-full items-stretch justify-center">
        {children}
      </div>
    </div>
  );
}

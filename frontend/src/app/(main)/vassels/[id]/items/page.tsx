"use client";

import React from "react";
import { useParams } from "next/navigation";
import { VasselItemList } from "@/features/vassel-item";

export default function VasselItemsPage() {
  const params = useParams();
  const idParam = params?.id as string | undefined;
  const vasselId = idParam ? Number(idParam) : NaN;

  if (!idParam || Number.isNaN(vasselId)) {
    return <div className="p-6 text-red-600">ID de embarcación inválido</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">
          Ítems de la embarcación #{vasselId}
        </h1>
        <VasselItemList vasselId={vasselId} />
      </div>
    </main>
  );
}

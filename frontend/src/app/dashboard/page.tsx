"use client";

import { useState, useMemo } from "react";

interface Item {
  id: number;
  name: string;
  status: string;
}

const ALL_ITEMS: Item[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `Elemento ${i + 1}`,
  status: i % 2 === 0 ? "Activo" : "Inactivo",
}));

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(
    () => ALL_ITEMS.filter((it) => it.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar elementos..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-grow rounded border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.status}</td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No hay resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
}

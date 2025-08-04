"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllEmbarcaciones } from "@/services/embarcacionService";
import { Embarcacion } from "@/types/embarcacion";

export default function DashboardPage() {
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEmbarcaciones();
        setEmbarcaciones(data);
      } catch (err) {
        console.error("Error al obtener embarcaciones", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(
    () => embarcaciones.filter((e) => e.nombre.toLowerCase().includes(search.toLowerCase())),
    [search, embarcaciones],
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mb-10 min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Embarcaciones</h1>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar por nombre de embarcaciones..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-grow rounded border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando embarcaciones...</p>
      ) : (
        <div className="overflow-x-auto rounded bg-white shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Capitán</th>
                <th className="px-4 py-2 text-left">Modelo</th>
                <th className="px-4 py-2 text-left">Patente</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">{item.capitan}</td>
                  <td className="px-4 py-2">{item.modelo}</td>
                  <td className="px-4 py-2">{item.npatente}</td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No hay embarcaciones encontradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer rounded-xl bg-[#2375AC] px-6 py-1 text-white disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer rounded-xl bg-[#2375AC] px-6 py-1 text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
}

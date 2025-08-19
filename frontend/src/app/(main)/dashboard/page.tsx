"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllEmbarcaciones,
  createEmbarcacion,
  updateEmbarcacion,
  deleteEmbarcacion,
} from "@/services/embarcacionService";
import { Embarcacion } from "@/types/embarcacion";
import { showConfirmAlert, showAlert, showAutoAlert } from "@/utils/showAlert";

export default function DashboardPage() {
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Partial<Embarcacion>>({});
  const pageSize = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllEmbarcaciones();
      setEmbarcaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener embarcaciones", err);
      setEmbarcaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await createEmbarcacion(formValues);
      setFormValues({});
      fetchData();
      showAutoAlert("¡Éxito!", "Embarcación creada correctamente.", "success");
    } catch (err) {
      console.error("Error al crear embarcación", err);
      showAutoAlert("Error", "No se pudo crear la embarcación.", "error");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateEmbarcacion(id, formValues);
      setEditId(null);
      setFormValues({});
      fetchData();

      showAutoAlert("Actualizado", "La embarcación ha sido actualizada correctamente.", "success");
    } catch (err) {
      console.error("Error al actualizar embarcación", err);
      showAutoAlert("Error", "Hubo un problema al actualizar la embarcación.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmAlert(
      "¿Estás seguro?",
      "Esta acción eliminará la embarcación permanentemente.",
      "Sí, eliminar",
      "Cancelar",
    );

    if (!confirmed) return;

    try {
      await deleteEmbarcacion(id);
      await fetchData();
      showAlert("Eliminado", "La embarcación fue eliminada correctamente.", "success");
    } catch (err) {
      console.error("Error al eliminar embarcación", err);
      showAlert("Error", "No se pudo eliminar la embarcación", "error");
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(embarcaciones)) return [];

    const searchLower = search.toLowerCase();
    return embarcaciones
      .filter(
        (e) =>
          e.nombre.toLowerCase().includes(searchLower) ||
          e.capitan.toLowerCase().includes(searchLower) ||
          e.modelo.toLowerCase().includes(searchLower) ||
          e.npatente.toLowerCase().includes(searchLower),
      )
      .sort((a, b) => a.id - b.id);
  }, [search, embarcaciones]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mb-10 min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Embarcaciones</h1>

      <div className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold">Nueva Embarcación</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formValues.nombre || ""}
            onChange={handleInputChange}
            className="rounded border px-3 py-1"
          />
          <input
            type="text"
            name="capitan"
            placeholder="Capitán"
            value={formValues.capitan || ""}
            onChange={handleInputChange}
            className="rounded border px-3 py-1"
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={formValues.modelo || ""}
            onChange={handleInputChange}
            className="rounded border px-3 py-1"
          />
          <input
            type="text"
            name="npatente"
            placeholder="Patente"
            value={formValues.npatente || ""}
            onChange={handleInputChange}
            className="rounded border px-3 py-1"
          />
          <button
            onClick={handleCreate}
            className="cursor-pointer rounded bg-[#2375AC] px-4 py-1 text-white hover:bg-[#2380ac]"
          >
            Agregar
          </button>
        </div>
      </div>

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
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">
                    {editId === item.id ? (
                      <input
                        type="text"
                        name="nombre"
                        value={formValues.nombre || ""}
                        onChange={handleInputChange}
                        className="rounded border px-2"
                      />
                    ) : (
                      item.nombre
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editId === item.id ? (
                      <input
                        type="text"
                        name="capitan"
                        value={formValues.capitan || ""}
                        onChange={handleInputChange}
                        className="rounded border px-2"
                      />
                    ) : (
                      item.capitan
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editId === item.id ? (
                      <input
                        type="text"
                        name="modelo"
                        value={formValues.modelo || ""}
                        onChange={handleInputChange}
                        className="rounded border px-2"
                      />
                    ) : (
                      item.modelo
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editId === item.id ? (
                      <input
                        type="text"
                        name="npatente"
                        value={formValues.npatente || ""}
                        onChange={handleInputChange}
                        className="rounded border px-2"
                      />
                    ) : (
                      item.npatente
                    )}
                  </td>
                  <td className="space-x-2 px-4 py-2">
                    {editId === item.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="cursor-pointer rounded bg-[#2375AC] px-3 py-1 text-white"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setFormValues({});
                          }}
                          className="cursor-pointer rounded bg-[#F87171] px-3 py-1 text-white"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(item.id);
                            setFormValues(item);
                          }}
                          className="cursor-pointer rounded bg-neutral-700 px-3 py-1 text-white"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer rounded bg-[#F87171] px-3 py-1 text-white"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
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
            className="cursor-pointer rounded-xl bg-[#0b1839] px-6 py-1 text-white disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer rounded-xl bg-[#0b1839] px-6 py-1 text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
}

"use client";
import React from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Usuario } from "@/types/Usuario";
import { UserAvatarIcon } from "@/assets/icons/UserAvatarIcon";

export default function ListaUsuario() {
  const { data, error, isLoading } = useApiQuery<Usuario[]>("usuarios", "/users");

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios: {error.message}</p>;

  return (
    <>
      <h1 className="text-3xl font-bold text-white">Usuarios</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {data?.map((usuario) => (
          <div
            key={usuario.id}
            className="flex max-w-4xl items-center gap-3 rounded-xl bg-amber-50 p-4"
          >
            <div className="h-16 w-16">
              <UserAvatarIcon />
            </div>

            <div className="flex flex-col justify-around text-left text-black">
              <h2 className="text-lg font-semibold text-blue-950">{usuario.name}</h2>
              <span className="text-sm text-gray-700">{usuario.email}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// src/app/page.tsx
import Image from "next/image";
import ListaUsuario from "@/components/ListaUsuario";
import fondo from "@/assets/images/fondo.png";

export default function Home() {
  return (
    <div className="relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      {/* Imagen de fondo */}
      <Image
        src={fondo}
        alt="Fondo corporativo"
        fill
        className="-z-10 object-cover object-center"
      />

      <main className="z-10 row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <ListaUsuario />
      </main>
      <footer className="z-10 row-start-3 flex flex-wrap items-center justify-center gap-[24px] text-white">
        <span>Prueba de Concepto</span>
        <span>Foo Talent Group</span>
        <span>Equipo 3 - Turno nocturno</span>
      </footer>
    </div>
  );
}

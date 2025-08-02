import ListaUsuario from "@/components/ListaUsuario";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <ListaUsuario />
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px] text-white">
        <span>Prueba de Concepto</span>
        <span>Foo Talent Group</span>
        <span>Equipo 3 - Turno nocturno</span>
      </footer>
    </div>
  );
}

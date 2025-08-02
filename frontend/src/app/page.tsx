import ListaUsuario from "@/components/ListaUsuario";
import fondo from "@/assets/images/fondo.png";

export default function Home() {
  return (
    <div
      className="relative grid min-h-screen grid-rows-[20px_auto_20px] items-start justify-items-center bg-cover bg-center p-8 sm:p-20"
      style={{ backgroundImage: `url(${fondo.src})` }}
    >
      <main className="z-10 row-start-2 -mt-12">
        <ListaUsuario />
      </main>
    </div>
  );
}

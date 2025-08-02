import Link from "next/link";

const PaginNotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
      <p className="mb-6 text-xl text-gray-300">Ups... la página que estás buscando no existe.</p>
      <Link
        href="/"
        className="rounded-lg bg-[#2375AC] px-6 py-2 font-medium text-amber-50 shadow transition hover:bg-[#2380ac]"
      >
        Volver al inicio
      </Link>
    </main>
  );
};

export default PaginNotFound;

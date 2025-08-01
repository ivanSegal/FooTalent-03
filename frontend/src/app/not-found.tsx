import Link from "next/link";

const PaginNotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-blue-950">404</h1>
      <p className="mb-6 text-xl text-gray-700">Ups... la página que estás buscando no existe.</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-950 px-6 py-2 text-amber-50 shadow transition hover:bg-amber-50 hover:text-blue-950"
      >
        Volver al inicio
      </Link>
    </main>
  );
};

export default PaginNotFound;

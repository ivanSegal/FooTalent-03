"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import logo from "@/assets/images/Logo.png";
import Cookies from "js-cookie";
import { showAlert, showAutoAlert } from "@/utils/showAlert";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { username, setUsername } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Barra transparente
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lectura del token
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasToken = document.cookie.includes("token=");
      setIsLoggedIn(hasToken);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("token");
    setUsername(null);
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    showAutoAlert("Sesión cerrada", "Has salido del sistema correctamente", "success", 2000);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-colors ${scrolled ? "bg-[#0b1839]/90" : "bg-[#0b1839]"} `}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-10">
        <Link href="/" className="flex-none">
          <Image src={logo} alt="IncaCore Logo" width={100} height={20} priority />
        </Link>

        {/* Mobile username display */}
        {isLoggedIn && username && (
          <span className="flex items-center gap-2 px-2 py-1 font-medium text-white md:hidden">
            Bienvenido, {username}
          </span>
        )}

        {/* Desktop */}
        <div className="hidden flex-1 justify-center space-x-8 md:flex">
          <Link href="/" className="font-medium text-white transition-colors hover:text-[#2375AC]">
            IncaCore
          </Link>
          <Link
            href="/dashboard"
            className={`font-medium text-white transition-colors hover:text-[#2375AC] ${
              pathname === "/dashboard" ? "text-teal-400" : ""
            }`}
          >
            Dashboard
          </Link>
        </div>

        {/* Botones de Auth y username desktop */}
        <div className="hidden items-center space-x-4 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-[#2375AC] px-5 py-2 font-medium text-white transition hover:bg-[#2380ac]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-[#2375AC] px-5 py-2 font-medium text-white transition hover:bg-[#2380ac] hover:text-white"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {username && (
                <span className="flex items-center gap-2 px-4 py-2 font-medium text-white">
                  Bienvenido, {username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-xl border border-[#F87171] px-5 py-2 font-medium text-white transition hover:bg-[#F87171]"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex-none cursor-pointer text-white focus:outline-none md:hidden"
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú Mobile */}
      {menuOpen && (
        <div className="w-full bg-[#0b1839]/90 backdrop-blur-sm md:hidden">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-white hover:text-[#2375AC]"
            >
              IncaCore
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-white hover:text-[#2375AC]"
            >
              Dashboard
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-3/4 rounded-xl bg-[#2375AC] px-5 py-2 text-center font-medium text-white hover:bg-[#2380ac]"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-3/4 rounded-xl border border-[#2375AC] px-5 py-2 text-center font-medium text-white hover:bg-[#2380ac] hover:text-white"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-3/4 rounded-xl border border-[#F87171] px-5 py-2 text-center font-medium text-white hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

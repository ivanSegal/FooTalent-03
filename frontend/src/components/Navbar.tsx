"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/Logo.png";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#0b1839]">
      <div className="mx-auto flex h-18 max-w-7xl items-center px-4">
        <div className="flex-none">
          <Link href="/">
            <Image src={logo} alt="Incacore Logo" width={100} height={20} priority />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center space-x-8">
          <Link href="/" className="font-medium text-white transition-colors hover:text-[#2375AC]">
            IncaCore
          </Link>
          <Link
            href="/dashboard"
            className={`text-white transition-colors hover:text-[#2375AC] ${
              pathname === "/dashboard" ? "font-medium text-teal-400" : "font-medium"
            }`}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex flex-none items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}

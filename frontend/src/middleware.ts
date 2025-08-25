import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Si es una ruta de autenticación y ya hay sesión válida, redirige al dashboard
  if (isAuthPath(pathname)) {
    if (token && !isJwtExpired(token)) {
      const to = req.nextUrl.clone();
      to.pathname = "/dashboard";
      to.search = "";
      return NextResponse.redirect(to);
    }
    return NextResponse.next();
  }

  // Si no hay token y no es ruta de autenticación, redirige a /login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Validación mínima: sólo verificar expiración (exp) sin comprobar firma
  if (isJwtExpired(token)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
    loginUrl.searchParams.set("reason", "expired");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Proteger secciones principales de la app autenticada
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    // secciones principales protegidas
    "/maintenance",
    "/maintenance/:path*",
    "/vassels",
    "/vassels/:path*",
    "/inventory",
    "/inventory/:path*",
    "/config",
    "/config/:path*",
    "/users",
    "/users/:path*",
    // páginas de autenticación (para redirigir si ya hay sesión)
    "/login",
    "/register",
    "/forgotpassword",
    "/auth/:path*",
  ],
};

// Helpers
function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payloadRaw = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadRaw || "{}");
    const exp = typeof payload.exp === "number" ? payload.exp : NaN;
    if (!exp || Number.isNaN(exp)) return true; // sin exp => tratar como expirado
    const now = Math.floor(Date.now() / 1000);
    // margen pequeño de 5s para evitar falsos positivos por desfase de reloj
    return now >= exp - 5;
  } catch {
    return true;
  }
}

function base64UrlDecode(input: string): string {
  // Convertir base64url a base64 estándar y añadir padding si falta
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Padded = base64 + padding;
  const binary = atob(base64Padded);
  try {
    // Decodificar a UTF-8
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch {
    // Fallback simple
    return binary;
  }
}

function isAuthPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgotpassword" ||
    pathname.startsWith("/auth/")
  );
}

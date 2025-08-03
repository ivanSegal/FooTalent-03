import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get("loggedIn")?.value;

  // Si no hay token de sesión, redirigimos al usuario a la página de inicio de sesión
  if (req.nextUrl.pathname.startsWith("/dashboard") && !loggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Si se identifica el token, lo validamos
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

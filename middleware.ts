/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

const protectedRoutes = ["/dashboard", "/horses", "/admin"];

export function middleware(req: any) {
  const path = req.nextUrl.pathname;

  // PUBLIC ROUTES
  if (!protectedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.redirect(new URL("/login", req.url));

  // Admin-only routes
  if (path.startsWith("/admin") && decoded.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/horses/:path*", "/admin/:path*"],
};

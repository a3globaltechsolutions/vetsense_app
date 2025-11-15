/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("vetsense_token")?.value;

    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Block clients
      if (decoded.role === "CLIENT") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // Allowed staff roles
      const allowedRoles = ["ADMIN", "VET_OFFICER", "ASSISTANT"];

      if (!allowedRoles.includes(decoded.role)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // Add user to request headers (optional)
      const res = NextResponse.next();
      res.headers.set("x-user-id", decoded.id);
      res.headers.set("x-user-role", decoded.role);

      return res;
    } catch (err) {
      console.error("JWT ERROR:", err);

      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// Match only dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};

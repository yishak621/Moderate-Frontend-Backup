import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const AUTH_PAGES = ["/login", "/register"]; // pages that don't require auth
const PROTECTED_PAGES = ["/dashboard", "/profile"]; // authenticated routes

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const impersonationToken = cookies["jwtImpersonation"];
  const regularToken = cookies["jwt"];
  const token = impersonationToken || regularToken;
  const role = cookies["role"];

  const { pathname } = req.nextUrl;

  if (token && AUTH_PAGES.some((page) => pathname.includes(page))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && PROTECTED_PAGES.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes -
  if (pathname.startsWith("/dashboard/admin")) {
    if (role !== "SYSTEM_ADMIN") {
      // If impersonating, redirect to teacher routes

      if (token && role === "TEACHER") {
        return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  if (pathname.startsWith("/dashboard/teacher")) {
    if (role !== "TEACHER") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  if (pathname.startsWith("/payment/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const AUTH_PAGES = ["/login", "/register"]; // pages that don't require auth
const PROTECTED_PAGES = ["/dashboard", "/profile"]; // authenticated routes

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies["jwt"];
  const role = cookies["role"];

  const { pathname } = req.nextUrl;

  // If the user is logged in and visits login/register, redirect to dashboard
  if (token && AUTH_PAGES.some((page) => pathname.includes(page))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not logged in and visits protected route, redirect to login
  if (!token && PROTECTED_PAGES.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes - only SYSTEM_ADMIN can access
  if (pathname.startsWith("/dashboard/admin")) {
    if (role !== "SYSTEM_ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Protect teacher routes - only TEACHER can access
  if (pathname.startsWith("/dashboard/teacher")) {
    if (role !== "TEACHER") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Allow request
  return NextResponse.next();
}

// Apply middleware only to certain paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};

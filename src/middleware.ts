import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const AUTH_PAGES = ["/login", "/register"]; // pages that don't require auth
const PROTECTED_PAGES = ["/dashboard", "/profile"]; // authenticated routes

export function middleware(req: NextRequest) {
  // DEBUG: log all cookies
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies["jwt"];
  const role = cookies["role"];

  const { pathname } = req.nextUrl;

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Pathname:", pathname);
  console.log("Token:", token);
  console.log("Cookies:", cookies);
  console.log("========================");

  // If the user is logged in and visits login/register, redirect to dashboard
  if (token && AUTH_PAGES.includes(pathname)) {
    console.log("Redirecting logged-in user away from auth page -> /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not logged in and visits protected route, redirect to login
  if (!token && PROTECTED_PAGES.some((page) => pathname.startsWith(page))) {
    console.log("Redirecting unauthenticated user to /login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protect admin routes - only SYSTEM_ADMIN can access
  if (pathname.startsWith("/dashboard/admin")) {
    if (role !== "SYSTEM_ADMIN") {
      console.log("Non-admin user trying to access admin route. Redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Protect teacher routes - only TEACHER can access
  if (pathname.startsWith("/dashboard/teacher")) {
    if (role !== "TEACHER") {
      console.log("Non-teacher user trying to access teacher route. Redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Allow request
  console.log("Access allowed to:", pathname);
  return NextResponse.next();
}

// Apply middleware only to certain paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

const AUTH_PAGES = ["/login", "/register"]; // pages that don't require auth
const PROTECTED_PAGES = ["/dashboard", "/profile"]; // authenticated routes
const ADMIN_ROUTES = ["/dashboard/admin"]; // routes that bypass maintenance
const PUBLIC_ROUTES = ["/maintenance", "/auth/login", "/auth/register"]; // routes accessible during maintenance

// Cache maintenance status for 30 seconds to avoid excessive API calls
let maintenanceCache: { status: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 1000; // 30 minutes

async function checkMaintenanceMode(): Promise<boolean> {
  // Check cache first
  if (
    maintenanceCache &&
    Date.now() - maintenanceCache.timestamp < CACHE_DURATION
  ) {
    return maintenanceCache.status;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Fetch platform settings from public endpoint
    const response = await fetch(`${apiUrl}/api/system/platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use a short timeout to avoid blocking
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      // If endpoint doesn't exist or fails, assume maintenance is off
      maintenanceCache = { status: false, timestamp: Date.now() };
      return false;
    }

    const data = await response.json();
    const isMaintenance = data?.settings?.find((setting: any) => {
      console.log(setting.key, "setting");
      return setting.key === "maintenance-mode" && setting.value[0] === "true";
    });
    console.log(isMaintenance, "isMaintenance");
    maintenanceCache = { status: isMaintenance, timestamp: Date.now() };
    return isMaintenance;
  } catch (error) {
    // On error, assume maintenance is off to avoid blocking users
    console.error("Failed to fetch maintenance status:", error);
    maintenanceCache = { status: false, timestamp: Date.now() };
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const impersonationToken = cookies["jwtImpersonation"];
  const regularToken = cookies["jwt"];
  const token = impersonationToken || regularToken;
  const role = cookies["role"];

  const { pathname } = req.nextUrl;

  // Allow maintenance page and public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check maintenance mode (skip for admin routes)
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAdminRoute) {
    const isMaintenance = await checkMaintenanceMode();

    if (isMaintenance) {
      // Redirect to maintenance page
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }
  }

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
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/maintenance",
    "/",
    "/about",
    "/features",
    "/pricing",
    "/contact",
    "/faqs",
  ],
};

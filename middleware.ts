// ===================================================================
// 📁 middleware.ts
// Location: REPLACE ENTIRE CONTENT of middleware.ts
// DEBUG: Fixed status route detection with console logging
// ===================================================================

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const locales = ["pt", "en", "es", "fr", "de"];
const defaultLocale = "pt";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: any }) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // 1. API routes should pass through
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // 2. Static assets should pass through
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/images/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // 3. ROOT HOMEPAGE FIX: Redirect / to /pt
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/pt", req.url));
    }

    // 4. Apply i18n middleware
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;

    // 5. Extract locale from URL
    const locale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    // DEBUG: Log for status route
    if (pathWithoutLocale === "/status") {
      console.log("🔍 DEBUG: Status route detected!", {
        pathname,
        locale,
        pathWithoutLocale,
        hasToken: !!token,
      });
    }

    // 6. PUBLIC ROUTES - Exact match and startsWith
    const publicPaths = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/auth/error",
      "/tours",
      "/status", // Exact match for status
    ];

    // Check exact match first, then startsWith for sub-routes
    const isPublicPath =
      publicPaths.includes(pathWithoutLocale) ||
      publicPaths.some(
        (path) => path !== "/" && pathWithoutLocale.startsWith(path)
      );

    if (isPublicPath) {
      console.log("✅ PUBLIC ROUTE ALLOWED:", pathWithoutLocale);
      return NextResponse.next();
    }

    // 7. AUTHENTICATION CHECK
    if (!token) {
      console.log("🔒 REDIRECTING TO LOGIN:", pathWithoutLocale);
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 8. ROLE-BASED ACCESS CONTROL
    const userRole = token.role as string;

    if (pathWithoutLocale.startsWith("/customer")) {
      if (userRole !== "customer" && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    if (pathWithoutLocale.startsWith("/host")) {
      if (userRole !== "host" && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    if (pathWithoutLocale.startsWith("/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/access-denied`, req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // API routes always authorized
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // Root redirect
        if (pathname === "/") {
          return true;
        }

        // Extract path
        const segments = pathname.split("/").filter(Boolean);
        if (segments.length === 0) return true;

        const pathWithoutLocale = "/" + segments.slice(1).join("/") || "/";

        // Public paths
        const publicPaths = [
          "/",
          "/auth/login",
          "/auth/signup",
          "/auth/error",
          "/tours",
          "/status",
        ];

        const isPublicPath =
          publicPaths.includes(pathWithoutLocale) ||
          publicPaths.some(
            (path) => path !== "/" && pathWithoutLocale.startsWith(path)
          );

        if (isPublicPath) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};

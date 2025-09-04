// ===================================================================
// 📁 components/auth/DevModeBypass.tsx
// Location: CRIAR components/auth/DevModeBypass.tsx
// ===================================================================

"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";

interface DevModeBypassProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Development mode bypass component
 * In development, allows access without authentication
 * In production, requires proper authentication
 */
export default function DevModeBypass({
  children,
  fallback,
}: DevModeBypassProps) {
  const { data: session, status } = useSession();

  // ✅ DEVELOPMENT MODE - Bypass authentication
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 DEV MODE: Bypassing authentication for testing");
    return <>{children}</>;
  }

  // ✅ PRODUCTION MODE - Require authentication
  if (status === "loading") {
    return fallback || <div>Loading...</div>;
  }

  if (!session) {
    return fallback || <div>Access denied</div>;
  }

  return <>{children}</>;
}

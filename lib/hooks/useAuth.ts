// ===================================================================
// 📁 lib/hooks/useAuth.ts - CLIENT-SIDE AUTH HOOK
// Location: CREATE file lib/hooks/useAuth.ts
// ===================================================================

"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    // Core session data
    user: session?.user,
    session,

    // Status helpers
    loading: status === "loading",
    authenticated: status === "authenticated",
    unauthenticated: status === "unauthenticated",

    // Role helpers
    isCustomer: session?.user?.role === "customer",
    isHost: session?.user?.role === "host",
    isAdmin: session?.user?.role === "admin",

    // Permission helpers
    hasRole: (role: "customer" | "host" | "admin") =>
      session?.user?.role === role,
    hasAnyRole: (roles: ("customer" | "host" | "admin")[]) =>
      session?.user ? roles.includes(session.user.role) : false,
    isHostOrAdmin: () =>
      session?.user?.role === "host" || session?.user?.role === "admin",

    // User data helpers
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    userName: session?.user?.name || null,
    userImage: session?.user?.image || null,
    isEmailVerified: session?.user?.emailVerified || false,
  };
}

// Custom hook for requiring authentication
export function useRequireAuth() {
  const auth = useAuth();

  if (auth.unauthenticated) {
    throw new Error("Authentication required");
  }

  return auth;
}

// Custom hook for requiring specific role
export function useRequireRole(role: "customer" | "host" | "admin") {
  const auth = useRequireAuth();

  if (!auth.hasRole(role)) {
    throw new Error(`Role '${role}' required`);
  }

  return auth;
}

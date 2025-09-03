// ===================================================================
// 📁 lib/hooks/useAuth.ts
// Location: CREATE file lib/hooks/useAuth.ts
// ===================================================================

"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    loading: status === "loading",
    authenticated: status === "authenticated",
    unauthenticated: status === "unauthenticated",
    isCustomer: session?.user?.role === "customer",
    isHost: session?.user?.role === "host",
    isAdmin: session?.user?.role === "admin",
  };
}

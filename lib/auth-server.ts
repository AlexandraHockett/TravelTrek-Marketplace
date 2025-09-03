// ===================================================================
// 📁 lib/auth-server.ts
// Location: CREATE new file lib/auth-server.ts
// ===================================================================

import { auth } from "@/lib/auth";
import { userQueries } from "@/lib/db/queries";
import type { Session } from "next-auth";

// Get current user session (server-side)
export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Get full session (server-side)
export async function getCurrentSession(): Promise<Session | null> {
  try {
    return await auth();
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
}

// Require authentication - throws if not authenticated
export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  return session;
}

// Check if user has specific role
export async function requireRole(role: "customer" | "host" | "admin") {
  const session = await requireAuth();

  if (session.user.role !== role) {
    throw new Error(`Role '${role}' required`);
  }

  return session;
}

// Check if user is host or admin
export async function requireHostOrAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "host" && session.user.role !== "admin") {
    throw new Error("Host or admin role required");
  }

  return session;
}

// Get user with full database details
export async function getCurrentUserFromDb() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return null;
  }

  try {
    return await userQueries.getById(user.id);
  } catch (error) {
    console.error("Error getting user from database:", error);
    return null;
  }
}

// Check if user owns resource
export async function checkResourceOwnership(resourceUserId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.id !== resourceUserId && user.role !== "admin") {
    throw new Error("Access denied");
  }

  return user;
}

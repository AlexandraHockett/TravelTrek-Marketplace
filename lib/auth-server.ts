// ===================================================================
// 📁 lib/auth-server.ts - NEXTAUTH v4 SERVER UTILITIES
// Location: REPLACE ENTIRE CONTENT of lib/auth-server.ts
// ===================================================================

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { userQueries } from "@/lib/db/queries";
import type { Session } from "next-auth";

// Get current user session (server-side)
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Get full session (server-side)
export async function getCurrentSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
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

// Check if user is authenticated (boolean helper)
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session?.user;
}

// Check if user has any of the specified roles
export async function hasAnyRole(
  roles: ("customer" | "host" | "admin")[]
): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

// Get user ID (shorthand helper)
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}

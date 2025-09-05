// ===================================================================
// 📁 lib/auth.ts - FIXED MANTENDO TUAS DECLARAÇÕES E ESTRUTURA BASE
// Location: SUBSTITUIR ficheiro existente
// ===================================================================

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// ✅ MANTENDO tuas declarações NextAuth exactas
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: "customer" | "host" | "admin";
      emailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "customer" | "host" | "admin";
    emailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "customer" | "host" | "admin";
    emailVerified?: boolean;
  }
}

// ✅ MANTENDO tua função helper exacta
function normalizeEmailVerified(
  value: Date | boolean | null | undefined
): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value instanceof Date) return true; // If there's a date, email is verified
  return undefined;
}

// ✅ FIXED: Helper to get pending role from sessionStorage
function getPendingRole(): "customer" | "host" | "admin" {
  // Check if we're in browser environment
  if (typeof window !== "undefined") {
    const pendingRole = sessionStorage.getItem("pendingRole");
    // Clear it after reading
    sessionStorage.removeItem("pendingRole");

    if (pendingRole === "host" || pendingRole === "admin") {
      return pendingRole;
    }
  }

  // Default to customer
  return "customer";
}

// ✅ MANTENDO tua estrutura authOptions exacta
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await userQueries.getByEmail(
            credentials.email as string
          );

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;

          // ✅ MANTENDO teu return exacto
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar || undefined,
            role: user.role,
            emailVerified: normalizeEmailVerified(user.emailVerified),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    // ✅ MANTENDO tuas callbacks JWT e session exactas
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "customer" | "host" | "admin";
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
    // ✅ FIXED: Google auth - só permite login se user já existir
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await userQueries.getByEmail(user.email);

          if (!existingUser) {
            // ✅ CRITICAL: Se user não existe, SEMPRE bloquear
            // O signup deve ser feito via API separada, não via NextAuth callback
            console.log(
              `❌ Google login BLOCKED - User ${user.email} não existe`
            );
            console.log("📝 User deve usar o signup primeiro");
            return false; // ❌ BLOQUEAR login se user não existir
          } else {
            // ✅ User existe - permitir login com role existente
            user.role = existingUser.role;
            user.id = existingUser.id;
            user.emailVerified = existingUser.emailVerified;
            console.log(
              `✅ Google login SUCCESS for ${user.email} as ${existingUser.role}`
            );
            return true;
          }
        } catch (error) {
          console.error("Error in Google auth:", error);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ MANTENDO teu export exacto
export default NextAuth(authOptions);

// ===================================================================
// 📁 lib/auth.ts - NEXTAUTH v4 CORRECTED VERSION
// Location: REPLACE ENTIRE CONTENT of lib/auth.ts
// ===================================================================

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// Extend NextAuth types for NextAuth v4
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

// Helper function to convert emailVerified from DB (Date | boolean | null) to NextAuth format (boolean | undefined)
function normalizeEmailVerified(
  value: Date | boolean | null | undefined
): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value instanceof Date) return true; // If there's a date, email is verified
  return undefined;
}

// Export authOptions for server-side usage (getServerSession)
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

          // Convert database types to NextAuth types with proper type handling
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
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await userQueries.getByEmail(user.email);

          if (!existingUser) {
            await userQueries.create({
              name: user.name || "",
              email: user.email,
              role: "customer",
              avatar: user.image || null,
              emailVerified: true,
              password: null,
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
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

// NextAuth v4 Configuration - Use authOptions
export default NextAuth(authOptions);

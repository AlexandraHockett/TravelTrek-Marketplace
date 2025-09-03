// ===================================================================
// 📁 lib/auth.ts - NEXTAUTH v4 WORKING VERSION
// Location: REPLACE ENTIRE CONTENT of lib/auth.ts
// ===================================================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

// Extend NextAuth types
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ⚠️ NO ADAPTER - Using JWT strategy for NextAuth v4

  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/Password
    Credentials({
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

          // Convert database types to NextAuth types
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar || undefined, // null → undefined
            role: user.role,
            emailVerified: user.emailVerified || undefined, // null → undefined
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
    // ⚠️ NO signUp - NextAuth v4 doesn't support it
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "customer" | "host" | "admin";
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Handle Google OAuth users
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
              password: null, // OAuth users don't need passwords
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
    strategy: "jwt", // Required for NextAuth v4 without adapter
  },

  secret: process.env.NEXTAUTH_SECRET,
});

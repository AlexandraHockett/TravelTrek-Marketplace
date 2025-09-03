// ===================================================================
// 📁 lib/auth.ts
// Location: CREATE file lib/auth.ts
// ===================================================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/client";
import { userQueries } from "@/lib/db/queries";
import bcrypt from "bcryptjs";

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
  adapter: DrizzleAdapter(db),

  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email/Password login
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

        // Find user in database
        const user = await userQueries.getByEmail(credentials.email as string);
        if (!user) {
          return null;
        }

        // Note: You'll need to add password field to user schema and hash passwords
        // This is a simplified version - implement proper password hashing
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password || "" // Add password field to user schema
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
    error: "/auth/error",
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
      // Auto-assign role for new Google users
      if (account?.provider === "google" && user.email) {
        const existingUser = await userQueries.getByEmail(user.email);
        if (!existingUser) {
          // Create new user with default customer role
          await userQueries.create({
            name: user.name || "",
            email: user.email,
            role: "customer",
            avatar: user.image || null,
            emailVerified: true, // Google emails are pre-verified
          });
        }
      }
      return true;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

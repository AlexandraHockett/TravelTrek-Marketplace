// ===================================================================
// 📁 app/api/auth/[...nextauth]/route.ts
// Location: REPLACE ENTIRE CONTENT of app/api/auth/[...nextauth]/route.ts
// ===================================================================

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth v4 handler using authOptions
const handler = NextAuth(authOptions);

// Export GET and POST for App Router compatibility
export { handler as GET, handler as POST };

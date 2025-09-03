// ===================================================================
// 📁 app/api/auth/[...nextauth]/route.ts
// Location: REPLACE existing file app/api/auth/[...nextauth]/route.ts
// ===================================================================

import { handlers } from "@/lib/auth";

// Export GET and POST handlers for NextAuth v4
export const { GET, POST } = handlers;

// Optional: Add middleware for debugging (remove in production)

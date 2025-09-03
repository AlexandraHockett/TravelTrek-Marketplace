// ===================================================================
// 📁 app/api/users/hosts/route.ts
// Location: CREATE file app/api/users/hosts/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";

// GET - Fetch all hosts (usa getHosts existente + stats opcionais)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get("includeStats") === "true";

    if (includeStats) {
      // Use the new getUsersWithStats function
      const result = await userQueries.getUsersWithStats({ role: "host" });

      return NextResponse.json({
        success: true,
        data: result.users,
        pagination: {
          total: result.total,
          limit: 10,
          offset: 0,
          hasMore: false,
          currentPage: 1,
          totalPages: 1,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      // Use existing getHosts function
      const hosts = await userQueries.getHosts();

      return NextResponse.json({
        success: true,
        data: hosts,
        pagination: {
          total: hosts.length,
          limit: hosts.length,
          offset: 0,
          hasMore: false,
          currentPage: 1,
          totalPages: 1,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error fetching hosts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hosts",
        code: "FETCH_HOSTS_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ===================================================================
// 📁 app/api/users/customers/route.ts
// Location: CREATE file app/api/users/customers/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { userQueries } from "@/lib/db/queries";

// GET - Fetch all customers (usa getCustomers existente + stats opcionais)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get("includeStats") === "true";

    if (includeStats) {
      // Use the new getUsersWithStats function
      const result = await userQueries.getUsersWithStats({ role: "customer" });

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
      // Use existing getCustomers function
      const customers = await userQueries.getCustomers();

      return NextResponse.json({
        success: true,
        data: customers,
        pagination: {
          total: customers.length,
          limit: customers.length,
          offset: 0,
          hasMore: false,
          currentPage: 1,
          totalPages: 1,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        code: "FETCH_CUSTOMERS_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

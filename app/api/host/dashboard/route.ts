// ===================================================================
// 📁 app/api/host/dashboard/route.ts
// Location: CRIAR app/api/host/dashboard/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";

interface DashboardStats {
  totalBookings: number;
  monthlyEarnings: number;
  averageRating: number;
  activeListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  earningsGrowth: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "review" | "payout";
    message: string;
    time: string;
    timestamp: string;
  }>;
  upcomingBookings: Array<{
    id: string;
    tourTitle: string;
    customerName: string;
    date: string;
    time: string;
    participants: number;
    status: string;
  }>;
}

// Mock data for testing
const MOCK_HOST_DATA: Record<string, DashboardStats> = {
  "current-host": {
    totalBookings: 47,
    monthlyEarnings: 2850.5,
    averageRating: 4.9,
    activeListings: 5,
    pendingBookings: 8,
    confirmedBookings: 23,
    completedBookings: 16,
    cancelledBookings: 0,
    thisMonthEarnings: 2850.5,
    lastMonthEarnings: 2120.25,
    earningsGrowth: 34.4,
    recentActivity: [
      {
        id: "1",
        type: "booking",
        message: "New booking for Porto Walking Tour by Ana Costa",
        time: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        type: "review",
        message: "Received 5-star review from Carlos Matos",
        time: "5 hours ago",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        type: "booking",
        message: "New booking for Lisbon Food Tour by Sofia Lima",
        time: "1 day ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "4",
        type: "payout",
        message: "Payment of €450 processed to your account",
        time: "2 days ago",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "5",
        type: "booking",
        message: "New booking for Sintra Adventure by Miguel Santos",
        time: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    upcomingBookings: [
      {
        id: "ub1",
        tourTitle: "Porto Walking Tour",
        customerName: "Ana Costa",
        date: "2025-09-06",
        time: "14:00",
        participants: 2,
        status: "confirmed",
      },
      {
        id: "ub2",
        tourTitle: "Lisbon Food Experience",
        customerName: "Carlos Ferreira",
        date: "2025-09-08",
        time: "10:30",
        participants: 4,
        status: "confirmed",
      },
      {
        id: "ub3",
        tourTitle: "Sintra Day Trip",
        customerName: "Isabel Rodrigues",
        date: "2025-09-10",
        time: "09:00",
        participants: 6,
        status: "pending",
      },
    ],
  },
  "test-host": {
    totalBookings: 12,
    monthlyEarnings: 890.75,
    averageRating: 4.6,
    activeListings: 2,
    pendingBookings: 3,
    confirmedBookings: 7,
    completedBookings: 2,
    cancelledBookings: 0,
    thisMonthEarnings: 890.75,
    lastMonthEarnings: 650.3,
    earningsGrowth: 37.0,
    recentActivity: [
      {
        id: "1",
        type: "booking",
        message: "New booking for Beach Tour by Pedro Silva",
        time: "1 hour ago",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ],
    upcomingBookings: [
      {
        id: "ub1",
        tourTitle: "Beach Adventure",
        customerName: "Pedro Silva",
        date: "2025-09-05",
        time: "16:00",
        participants: 3,
        status: "pending",
      },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Host Dashboard API called");

    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get("hostId");

    console.log("📊 Host ID requested:", hostId);

    // Validate hostId parameter
    if (!hostId) {
      console.log("❌ No host ID provided");
      return NextResponse.json(
        {
          error: "Host ID is required",
          message: "Missing hostId parameter in request",
        },
        { status: 400 }
      );
    }

    // Simulate API delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get mock data
    const hostStats = MOCK_HOST_DATA[hostId];

    if (!hostStats) {
      console.log("❌ Host not found:", hostId);
      return NextResponse.json(
        {
          error: "Host not found",
          message: `No data found for host ${hostId}`,
          availableHosts: Object.keys(MOCK_HOST_DATA),
        },
        { status: 404 }
      );
    }

    console.log("✅ Host data found, returning stats");
    console.log("📈 Stats preview:", {
      totalBookings: hostStats.totalBookings,
      monthlyEarnings: hostStats.monthlyEarnings,
      activeListings: hostStats.activeListings,
    });

    // Add cache headers for performance
    const response = NextResponse.json(hostStats);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error) {
    console.error("💥 Error in host dashboard API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while loading dashboard data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST method for updating host preferences
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Host Dashboard POST called");

    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get("hostId");

    if (!hostId) {
      return NextResponse.json(
        {
          error: "Host ID is required",
          message: "Missing hostId parameter in request",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("📝 Update request body:", body);

    // TODO: Implement actual dashboard update logic
    // Example: await updateHostDashboardPreferences(hostId, body);

    return NextResponse.json({
      success: true,
      message: "Dashboard preferences updated successfully",
      hostId,
      updatedFields: Object.keys(body),
    });
  } catch (error) {
    console.error("💥 Error updating host dashboard:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while updating dashboard",
      },
      { status: 500 }
    );
  }
}

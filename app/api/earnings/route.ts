// File: app/api/earnings/route.ts
// Location: CREATE this file in app/api/earnings/route.ts

import { NextRequest, NextResponse } from "next/server";

interface EarningsData {
  period: string;
  amount: number;
  bookings: number;
  month?: string;
  year?: number;
}

interface EarningsSummary {
  thisMonth: number;
  lastMonth: number;
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  currency: string;
  growth: number;
  monthlyData: EarningsData[];
}

// Mock earnings data generator
function generateMockEarnings(
  period: string,
  hostId?: string
): EarningsSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Generate monthly data based on period
  let monthsBack: number;
  switch (period) {
    case "1year":
      monthsBack = 12;
      break;
    case "all":
      monthsBack = 24;
      break;
    case "6months":
    default:
      monthsBack = 6;
      break;
  }

  const monthlyData: EarningsData[] = [];
  let totalEarnings = 0;

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthName = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    // Generate realistic earnings data with some variation
    const baseAmount = 800 + Math.random() * 600; // €800-1400 base
    const seasonalMultiplier =
      Math.sin(((date.getMonth() + 1) * Math.PI) / 6) * 0.3 + 1; // Summer peak
    const trendMultiplier = 1 + (monthsBack - i - 1) * 0.05; // Growing trend

    const amount = Math.round(
      baseAmount * seasonalMultiplier * trendMultiplier
    );
    const bookings = Math.round(amount / 65); // Average €65 per booking

    monthlyData.push({
      period: monthName,
      amount,
      bookings,
      month: date.toLocaleDateString("en-US", { month: "long" }),
      year: date.getFullYear(),
    });

    totalEarnings += amount;
  }

  // Calculate this month vs last month
  const thisMonth = monthlyData[monthlyData.length - 1]?.amount || 0;
  const lastMonth = monthlyData[monthlyData.length - 2]?.amount || 0;
  const growth =
    lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  // Calculate pending and completed payouts
  const pendingPayouts = Math.round(thisMonth * 0.15); // 15% pending
  const completedPayouts = totalEarnings - pendingPayouts;

  return {
    thisMonth,
    lastMonth,
    totalEarnings,
    pendingPayouts,
    completedPayouts,
    currency: "EUR",
    growth,
    monthlyData,
  };
}

// GET - Fetch earnings data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get("hostId");
    const period = searchParams.get("period") || "6months";

    // Validate period
    const validPeriods = ["6months", "1year", "all"];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Must be one of: 6months, 1year, all" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Validate the hostId and check authentication
    // 2. Query the database for actual earnings data
    // 3. Apply proper filters and aggregations

    // For demo purposes, we'll generate mock data
    console.log(
      `[EARNINGS API] Fetching earnings for host: ${hostId || "demo"}, period: ${period}`
    );

    const earningsData = generateMockEarnings(period, hostId || undefined);

    // Add some delay to simulate database query
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(earningsData);
  } catch (error: any) {
    console.error("Error in earnings API:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new earnings entry (for manual adjustments)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostId, amount, description, type } = body;

    // Validation
    if (!hostId || !amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "hostId and amount are required" },
        { status: 400 }
      );
    }

    if (amount < 0) {
      return NextResponse.json(
        { error: "Amount cannot be negative" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Validate the host exists and user has permission
    // 2. Insert the earnings adjustment into the database
    // 3. Update related booking or payout records

    const earningsEntry = {
      id: `earning_${Date.now()}`,
      hostId,
      amount,
      description: description || "Manual earnings adjustment",
      type: type || "adjustment", // booking, adjustment, bonus, etc.
      createdAt: new Date().toISOString(),
      currency: "EUR",
    };

    console.log(`[EARNINGS API] Created earnings entry:`, earningsEntry);

    return NextResponse.json(earningsEntry, { status: 201 });
  } catch (error: any) {
    console.error("Error creating earnings entry:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update earnings entry
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { earningsId, amount, description, status } = body;

    // Validation
    if (!earningsId) {
      return NextResponse.json(
        { error: "earningsId is required" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Find the existing earnings entry
    // 2. Validate user has permission to update it
    // 3. Update the database record
    // 4. Potentially trigger payout calculations

    const updatedEntry = {
      id: earningsId,
      amount: amount || 0,
      description: description || "Updated earnings entry",
      status: status || "active",
      updatedAt: new Date().toISOString(),
    };

    console.log(`[EARNINGS API] Updated earnings entry:`, updatedEntry);

    return NextResponse.json(updatedEntry);
  } catch (error: any) {
    console.error("Error updating earnings entry:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// File: app/api/tours/route.ts
// Location: Create this NEW file in app/api/tours/

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Return the list of tours (first 3 for demo)
    return NextResponse.json(mockTours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

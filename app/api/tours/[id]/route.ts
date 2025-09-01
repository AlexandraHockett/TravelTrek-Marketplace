// File: app/api/tours/[id]/route.ts
// Location: SUBSTITUIR o ficheiro existente app/api/tours/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mockTours } from "@/lib/db/mockData";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single tour by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const tour = mockTours.find((t) => t.id === id);

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

// PUT - Update a tour
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tourIndex = mockTours.findIndex((t) => t.id === id);
    if (tourIndex === -1) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // ✅ CORRIGIDO: Validate duration if provided
    if (body.duration !== undefined) {
      if (typeof body.duration !== "number" || body.duration <= 0) {
        return NextResponse.json(
          { error: "Duration must be a positive number (in minutes)" },
          { status: 400 }
        );
      }
    }

    // ✅ CORRIGIDO: Validate required fields have correct types
    if (
      body.price !== undefined &&
      (typeof body.price !== "number" || body.price <= 0)
    ) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    if (
      body.maxParticipants !== undefined &&
      (typeof body.maxParticipants !== "number" || body.maxParticipants <= 0)
    ) {
      return NextResponse.json(
        { error: "MaxParticipants must be a positive number" },
        { status: 400 }
      );
    }

    if (
      body.rating !== undefined &&
      (typeof body.rating !== "number" || body.rating < 0 || body.rating > 5)
    ) {
      return NextResponse.json(
        { error: "Rating must be a number between 0 and 5" },
        { status: 400 }
      );
    }

    // Update tour
    const updatedTour = {
      ...mockTours[tourIndex],
      ...body,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };

    mockTours[tourIndex] = updatedTour;

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tour
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const tourIndex = mockTours.findIndex((t) => t.id === id);

    if (tourIndex === -1) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Remove tour from mock database
    mockTours.splice(tourIndex, 1);

    return NextResponse.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
